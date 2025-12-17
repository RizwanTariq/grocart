import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import { convertIds } from "@/types";
import ProductModel from "@/models/products.model";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    if (!request.auth) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }
    const products = await ProductModel.find({}).lean();

    return NextResponse.json(convertIds(products), { status: 200 });
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});
