import { auth } from "@/auth";
import { MAX_PAYMENT_ATTEMPTS } from "@/constants/orders";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { assertUser } from "@/server/auth/assertUser";
import { assertOrder } from "@/server/order/assertOrder";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN!);

export const POST = auth(async function (request, context) {
  const params = await context.params;
  let orderId;
  let stripeSesId;
  try {
    await connectDB();
    const paramOrderId = await params.orderId;
    const user = await assertUser(request.auth?.user?.id as string);
    const order = await assertOrder(user._id, paramOrderId);

    if (order.stripeSessionId) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Payment already in progress"),
        { status: 409 }
      );
    }

    if (order.paymentMethod !== PAYMENT_METHOD.CARD) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Retry not allowed for COD"),
        { status: 400 }
      );
    }

    if (order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Order already paid"),
        { status: 400 }
      );
    }

    if (
      order.status === ORDER_STATUS.EXPIRED ||
      (order.expiresAt && order.expiresAt < new Date())
    ) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Order expired"),
        { status: 400 }
      );
    }

    if ((order.paymentAttempts ?? 0) >= MAX_PAYMENT_ATTEMPTS) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Payment attempts exceeded"),
        { status: 400 }
      );
    }

    orderId = order._id.toHexString();
    const orderNumber = order.orderNumber;
    const totalAmount = order.totalAmount;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `GroCart - Order # ${orderNumber}`,
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
      },
      { idempotencyKey: `${orderId}-attempt-${order.paymentAttempts! + 1}` }
    );
    stripeSesId = session.id;

    const updated = await OrderModel.updateOne(
      {
        _id: order._id,
        stripeSessionId: undefined,
        paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
        status: ORDER_STATUS.PENDING,
        expiresAt: { $gt: new Date() },
        paymentAttempts: { $lt: MAX_PAYMENT_ATTEMPTS },
      },
      {
        stripeSessionId: session.id,
        $inc: { paymentAttempts: 1 },
      }
    );

    if (updated.modifiedCount === 0) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Payment retry no longer allowed"),
        { status: 409 }
      );
    }

    return NextResponse.json(
      { paymentRedirectUrl: session.url },
      { status: 200 }
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
