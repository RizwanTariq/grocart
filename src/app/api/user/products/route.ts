import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import { convertIds } from "@/types";
import ProductModel from "@/models/products.model";
import { assertUser } from "@/server/auth/assertUser";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    await assertUser(request);
    const products = await ProductModel.find({}).lean();

    return NextResponse.json(convertIds(products), { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});
