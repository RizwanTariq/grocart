import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import { NextResponse } from "next/server";

export const GET = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertAdmin(request);
    const order = await OrderModel.findById(orderId)
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

    return NextResponse.json(convertId(order), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
