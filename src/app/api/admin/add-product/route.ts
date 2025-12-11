import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/libs/cloudinary";
import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { NextResponse } from "next/server";

export const POST = auth(async function (request) {
  try {
    connectDB();
    if (!request.auth) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }

    if (request.auth?.user?.role !== "admin") {
      return new NextResponse("Unauthorized: Only admin can add product", {
        status: 401,
      });
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
      return new NextResponse("Missing required fields", { status: 400 });
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

    return new NextResponse(JSON.parse(JSON.stringify(product)), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});
