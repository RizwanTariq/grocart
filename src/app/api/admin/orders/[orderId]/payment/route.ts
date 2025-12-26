import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import { PAYMENT_STATUS } from "@/types/enums";
import { NextResponse } from "next/server";

export const PATCH = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertAdmin(request);

    const { paymentStatus } = await request.json();

    if (!Object.values(PAYMENT_STATUS).includes(paymentStatus)) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
      },
      { new: true }
    );

    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(convertId(order.toObject()), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
