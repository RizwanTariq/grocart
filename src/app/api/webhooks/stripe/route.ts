import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";

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

  await connectDB();

  console.log(event, "stripe event-----------------");

  try {
    switch (event.type) {
      /**
       * ✅ PAYMENT SUCCESS
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (!orderId || session.payment_status !== "paid") break;

        await OrderModel.findOneAndUpdate(
          {
            _id: castIdToObjectId(orderId),
            paymentStatus: { $ne: PAYMENT_STATUS.PAYMENT_PAID },
            status: { $ne: ORDER_STATUS.CONFIRMED },
          },
          {
            paymentStatus: PAYMENT_STATUS.PAYMENT_PAID,
            status: ORDER_STATUS.CONFIRMED,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent || null,
            expiresAt: null,
          }
        );

        break;
      }
      /**
       * ⚠️ SESSION EXPIRED (NON-FATAL)
       * Session is unusable, payment may still complete later
       */
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (!orderId) break;

        await OrderModel.findOneAndUpdate(
          {
            _id: castIdToObjectId(orderId),
            paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
          },
          {
            stripeSessionId: null, // allow for retry
          }
        );
        break;
      }
      /**
       * ❌ Attempt failed → retry allowed
       */
      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log(intent, "Intent ----");

        // payment_intent does NOT always carry metadata
        const orderId = intent.metadata?.orderId;
        if (!orderId) break;

        await OrderModel.findOneAndUpdate(
          {
            _id: castIdToObjectId(orderId),
            paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
          },
          {
            // Do NOT cancel
            // Do NOT mark failed
            // Allow retry
            stripePaymentIntentId: intent.id,
            stripeSessionId: null,
          }
        );

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
      prepareErrorResponse("STRIPE_ERROR", "Error handling webhook"),
      { status: 500 }
    );
  }
}
