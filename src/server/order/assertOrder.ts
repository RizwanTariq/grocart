import { NextResponse } from "next/server";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";
import OrderModel from "@/models/order.model";
import { Types } from "mongoose";

export async function assertOrder(userId: Types.ObjectId, orderId: string) {
  const order = await OrderModel.findOne({
    _id: castIdToObjectId(orderId),
    user: userId,
  });

  if (!order) {
    throw NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Order not found",
        },
      },
      { status: 404 }
    );
  }

  return order;
}
