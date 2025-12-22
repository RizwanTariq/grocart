import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");

  if (cronSecret !== process.env.CRON_SECRET) {
    throw NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized request",
        },
      },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const result = await OrderModel.updateMany(
      {
        expiresAt: { $lte: new Date() },
        paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
        status: ORDER_STATUS.PENDING,
      },
      {
        status: ORDER_STATUS.EXPIRED,
        paymentStatus: PAYMENT_STATUS.PAYMENT_FAILED,
      }
    );

    return NextResponse.json({
      expiredOrders: result.modifiedCount,
    });
  } catch (error) {
    return handleGenericError(error);
  }
}
