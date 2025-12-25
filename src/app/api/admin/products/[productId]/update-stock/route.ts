import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";
import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import { USER_ROLE } from "@/types/enums";

export const PATCH = auth(async function (request, context) {
  const params = await context.params;
  try {
    const productId = await params.productId;
    await connectDB();
    const user = await assertUser(request);

    if (user.role !== USER_ROLE.ADMIN) {
      throw NextResponse.json(
        prepareErrorResponse(
          "UNAUTHORIZED",
          "Unauthorized: Only admin can update a product"
        ),

        { status: 401 }
      );
    }
    const formData = await request.formData();

    const countInStock = Number(formData.get("countInStock")?.toString() || 0);

    if (!countInStock) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const product = await ProductModel.findByIdAndUpdate(
      castIdToObjectId(productId),
      {
        countInStock,
      }
    );

    if (!product) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Product not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(convertId(product.toObject()), {
      status: 201,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
