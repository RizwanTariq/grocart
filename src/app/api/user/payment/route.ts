import { auth } from "@/auth";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { generateOrderNumber } from "@/libs/orderNumGenerator";
import { IOrderItem } from "@/types";
import Stripe from "stripe";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN!);

export const POST = auth(async function (request) {
  let orderId;
  let stripeSesId;
  try {
    await connectDB();

    const { paymentMethod, address, items, totalAmount, coordinates } =
      await request.json();

    if (!paymentMethod || !address || !items || !items.length || !totalAmount) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing required fields",
          },
        },
        { status: 400 }
      );
    }

    if (!request.auth) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Unauthenticated",
          },
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(
      new mongoose.Types.ObjectId(request.auth?.user?.id)
    ).lean();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Unauthenticated: User not found",
          },
        },
        { status: 401 }
      );
    }

    const orderNumber = await generateOrderNumber();

    const order = await OrderModel.create({
      user: user._id,
      orderNumber: orderNumber,
      items: items.map((i: IOrderItem) => ({
        product: new mongoose.Types.ObjectId(i._id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
      })),
      totalAmount: totalAmount,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
      paymentMethod: paymentMethod,
      address: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        fullAddress: address.address,
        city: address.city,
        postalCode: address.postalCode,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null,
        },
      },
    });

    orderId = order._id.toHexString();

    const stripeSession = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `GroCart -Order # ${orderNumber} Payment`,
              },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/success?order_no=${orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/cancel?order_no=${orderNumber}`,
        metadata: {
          orderId,
        },
      },
      { idempotencyKey: orderId }
    );

    order.stripeSessionId = stripeSesId = stripeSession.id;
    await order.save();

    return NextResponse.json(
      { paymentRedirectUrl: stripeSession.url },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation/payment error:", { error, orderId });
    let errorRes;
    let statusCode;
    if (orderId && !stripeSesId) {
      await OrderModel.findByIdAndUpdate(new mongoose.Types.ObjectId(orderId), {
        paymentStatus: PAYMENT_STATUS.PAYMENT_FAILED,
        status: ORDER_STATUS.CANCELLED,
      });
      // Payment failed but order exists
      statusCode = 402; // Payment Required
      errorRes = {
        code: "PAYMENT_FAILED",
        message:
          "Facing error while processing payment. Please try again or choose another payment method.",
      };
    } else {
      // Something went wrong before order creation
      statusCode = 500;
      errorRes = {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error occurred. Please try again later.",
      };
    }
    return NextResponse.json({ error: errorRes }, { status: statusCode });
  }
});
