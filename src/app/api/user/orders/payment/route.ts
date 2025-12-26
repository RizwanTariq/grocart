import { auth } from "@/auth";
import connectDB from "@/libs/db";
import { NextResponse } from "next/server";
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { generateOrderNumber } from "@/libs/orderNumGenerator";
import { IOrderItem } from "@/types";
import Stripe from "stripe";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { ORDER_TTL_MINUTES } from "@/constants/orders";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN!);

export const POST = auth(async function (request) {
  let orderId;
  let stripeSesId;
  try {
    await connectDB();

    const { address, items, totalAmount } = await request.json();

    if (!address || !items || !items.length || !totalAmount) {
      throw NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing required fields",
          },
        },
        { status: 400 }
      );
    }

    const user = await assertUser(request.auth?.user?.id as string);

    const orderNumber = await generateOrderNumber();

    const expiresAt = new Date(Date.now() + ORDER_TTL_MINUTES * 60 * 1000);

    const order = await OrderModel.create({
      user: user._id,
      orderNumber: orderNumber,
      items: items.map((i: IOrderItem) => ({
        product: new mongoose.Types.ObjectId(i._id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
        image: i.image,
      })),
      totalAmount: totalAmount,
      status: ORDER_STATUS.PENDING,
      paymentMethod: PAYMENT_METHOD.CARD,
      paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
      paymentAttempts: 1,
      address: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        fullAddress: address.address,
        city: address.city,
        postalCode: address.postalCode,
        coordinates: {
          lat: address.coordinates?.lat || null,
          lng: address.coordinates?.lng || null,
        },
      },
      expiresAt,
    });

    orderId = order._id.toHexString();

    const stripeSession = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `GroCart -Order # ${orderNumber}`,
              },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        payment_method_types: ["card"],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/cancel?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          orderId,
        },
        payment_intent_data: {
          metadata: {
            orderId,
          },
        },
        // expires_at: Math.floor(Date.now() / 1000) + 1800,
      },
      { idempotencyKey: `${orderId}-attempt-${order.paymentAttempts}` }
    );

    order.stripeSessionId = stripeSesId = stripeSession.id;
    await order.save();

    return NextResponse.json(
      { paymentRedirectUrl: stripeSession.url },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Order creation/payment error:", { error, orderId });
    let errorRes;
    let statusCode;
    if (orderId && !stripeSesId) {
      // Payment failed but order exists
      statusCode = 402; // Payment Required
      errorRes = prepareErrorResponse(
        "PAYMENT_FAILED",
        "Facing error while processing payment. Please try again or choose another payment method.",
        orderId
      );
    } else {
      // Something went wrong before order creation
      statusCode = 500;
      errorRes = prepareErrorResponse(
        "INTERNAL_SERVER_ERROR",
        "Unexpected error occurred. Please try again later."
      );
    }
    return NextResponse.json({ error: errorRes }, { status: statusCode });
  }
});
