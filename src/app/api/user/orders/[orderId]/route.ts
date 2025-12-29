import { auth } from "@/auth";
import { MAX_PAYMENT_ATTEMPTS } from "@/constants/orders";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { NextResponse } from "next/server";

export const GET = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertUser(request.auth?.user?.id as string);
    const order = await OrderModel.findOne({
      _id: orderId,
      user: request.auth?.user?.id,
    })
      .populate([
        {
          path: "user",
          select: "-password",
        },
        {
          path: "assignedDeliveryBoy",
          select: "-password",
        },
      ])
      .lean();

    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    const isPaymentRetryAllowed =
      !order.stripeSessionId &&
      order.paymentMethod === PAYMENT_METHOD.CARD &&
      order.paymentStatus === PAYMENT_STATUS.PAYMENT_PENDING &&
      order.status === ORDER_STATUS.PENDING &&
      order.expiresAt &&
      order.expiresAt > new Date() &&
      (order.paymentAttempts ?? 0) < MAX_PAYMENT_ATTEMPTS;

    return NextResponse.json(convertId({ ...order, isPaymentRetryAllowed }), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
