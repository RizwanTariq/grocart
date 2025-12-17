import mongoose, { Model } from "mongoose";
import { IProductDB } from "../types";
import { PRODUCT_CATEGORY, PRODUCT_UNIT } from "@/types/enums";

export const productSchema = new mongoose.Schema<IProductDB>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORY),
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: {
      type: String,
      enum: Object.values(PRODUCT_UNIT),
      required: true,
    },
    image: { type: String, required: true },
    countInStock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// In case of hot-reloading in development, we check if the model already exists
const ProductModel =
  (mongoose.models.Product as Model<IProductDB>) ||
  mongoose.model<IProductDB>("Product", productSchema);

export default ProductModel;
