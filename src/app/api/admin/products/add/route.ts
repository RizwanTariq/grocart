import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/libs/cloudinary";
import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId } from "@/types";
import { USER_ROLE } from "@/types/enums";
import { NextResponse } from "next/server";

export const POST = auth(async function (request) {
  try {
    await connectDB();
    const user = await assertUser(request);

    if (user.role !== USER_ROLE.ADMIN) {
      throw NextResponse.json(
        prepareErrorResponse(
          "UNAUTHORIZED",
          "Unauthorized: Only admin can add product"
        ),

        { status: 401 }
      );
    }
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString();
    const price = Number(formData.get("price")?.toString() || 0);
    const unit = formData.get("unit")?.toString();
    const countInStock = Number(formData.get("countInStock")?.toString() || 0);

    const image = formData.get("image") as Blob | null;

    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !unit ||
      !countInStock ||
      !image
    ) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }
    const imgeUrl = await uploadOnCloudinary(image);

    const product = await ProductModel.create({
      name,
      description,
      category,
      price,
      unit,
      countInStock,
      image: imgeUrl || "",
    });

    return NextResponse.json(convertId(product.toObject()), {
      status: 201,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
