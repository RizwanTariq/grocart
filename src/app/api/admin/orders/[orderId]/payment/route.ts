import { auth } from "@/auth";
import connectDB from "@/libs/db";
import eventEmitter from "@/libs/eventEmitter";
import OrderModel from "@/models/order.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId, IOrderPopulated } from "@/types";
import { PAYMENT_STATUS } from "@/types/enums";
import { EmitterEvent } from "@/types/generic";
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
    ).populate({
      path: "user",
      select: "-password",
    });

    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    const userSocketId = (order as unknown as IOrderPopulated).user?.socketId;
    if (userSocketId) {
      await eventEmitter(
        EmitterEvent.ORDER_UPDATED,
        JSON.parse(JSON.stringify(order)),
        userSocketId
      );
    }

    return NextResponse.json(convertId(order.toObject()), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
