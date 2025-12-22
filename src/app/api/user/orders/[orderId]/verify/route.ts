import { auth } from "@/auth";
import connectDB from "@/libs/db";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { assertOrder } from "@/server/order/assertOrder";
import { NextResponse } from "next/server";

export const GET = auth(async function (request, context) {
  const params = await context.params;

  try {
    await connectDB();
    const orderId = await params.orderId;
    if (!orderId) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing order number"),
        { status: 400 }
      );
    }
    const user = await assertUser(request);
    const order = await assertOrder(user._id, orderId);

    return NextResponse.json(
      {
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderNumber: order.orderNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGenericError(error);
  }
});
