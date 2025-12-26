import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertIds } from "@/types";
import { NextResponse } from "next/server";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    await assertAdmin(request);
    const orders = await OrderModel.find({}).lean();

    return NextResponse.json(convertIds(orders), { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});
