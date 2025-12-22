import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/libs/db";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { assertUser } from "@/server/auth/assertUser";
import { assertOrder } from "@/server/order/assertOrder";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

export const POST = auth(async (req, context) => {
  const params = await context.params;
  try {
    await connectDB();
    const orderId = await params.orderId;

    const user = await assertUser(req);

    const order = await assertOrder(user._id, orderId);

    if (order.paymentMethod !== PAYMENT_METHOD.CARD) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Not a card payment order"),
        { status: 400 }
      );
    }

    if (order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID) {
      return NextResponse.json(
        { message: "Order already paid", orderNo: order.orderNumber },
        { status: 200 }
      );
    }

    // Only clear stripeSessionId if session still exists
    if (order.stripeSessionId) {
      order.stripeSessionId = null;
      await order.save();
    }

    return NextResponse.json(
      {
        orderNo: order.orderNumber,
        message: "You can retry the payment for this order.",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGenericError(error);
  }
});
