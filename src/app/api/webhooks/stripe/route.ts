import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN!);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Ignore test events in production
  //   if (process.env.NODE_ENV === "production" && !event.livemode) {
  //     return NextResponse.json({ received: true });
  //   }

  await connectDB();
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        if (!orderId || session.payment_status !== "paid") break;

        const order = await OrderModel.findById(new Types.ObjectId(orderId));
        if (!order || order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
          break;

        await OrderModel.findByIdAndUpdate(new Types.ObjectId(orderId), {
          paymentStatus: PAYMENT_STATUS.PAYMENT_PAID,
          stripePaymentIntentId: session.payment_intent || undefined,
        });

        break;
      }
      case "checkout.session.expired":
      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        if (!orderId) break;

        const order = await OrderModel.findById(new Types.ObjectId(orderId));
        if (!order || order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
          break;

        await OrderModel.findByIdAndUpdate(new Types.ObjectId(orderId), {
          paymentStatus: PAYMENT_STATUS.PAYMENT_FAILED,
          status: ORDER_STATUS.CANCELLED,
        });
        break;
      }
      default:
        console.warn("Unhandled Stripe event type:", event.type);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error handling webhook:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
