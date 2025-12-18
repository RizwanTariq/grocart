import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { NextResponse } from "next/server";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("order_no");
    if (!orderNumber) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing order number",
          },
        },
        { status: 400 }
      );
    }
    if (!request.auth) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Unauthenticated",
          },
        },
        { status: 401 }
      );
    }
    const order = await OrderModel.findOne({ orderNumber }).lean();
    if (!order) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Order not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});
