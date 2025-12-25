import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/libs/cloudinary";
import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId, IProductDB } from "@/types";
import { PRODUCT_CATEGORY, PRODUCT_UNIT, USER_ROLE } from "@/types/enums";

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
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString() as PRODUCT_CATEGORY;
    const price = Number(formData.get("price")?.toString() || 0);
    const unit = formData.get("unit")?.toString() as PRODUCT_UNIT;
    const countInStock = Number(formData.get("countInStock")?.toString() || 0);

    const image = formData.get("image") as Blob | null | string;

    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !unit ||
      !countInStock
    ) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const updated: Partial<IProductDB> = {
      name,
      description,
      category,
      price,
      unit,
      countInStock,
    };

    if (image && typeof image !== "string") {
      updated.image = await uploadOnCloudinary(image);
    }

    const product = await ProductModel.findByIdAndUpdate(productId, updated, {
      new: true,
    });

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

export const GET = auth(async function (request, context) {
  const params = await context.params;
  try {
    const productId = await params.productId;
    await connectDB();
    await assertUser(request);
    const product = await ProductModel.findById(productId).lean();

    if (!product) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Product not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(convertId(product), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});
