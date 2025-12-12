import mongoose, { Model } from "mongoose";
import { IProductDB } from "../types";

export const productSchema = new mongoose.Schema<IProductDB>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "VAGETABLES",
        "FRUITS",
        "DAIRY_EGGS",
        "GRAINS",
        "SEAFOOD",
        "SPICES",
        "BAVERAGES",
        "PERSONAL_CARE",
        "HOUSEHOLD_ESSENTIALS",
        "PACKAGED_FOOD",
        "BABY_CARE",
        "PET_CARE",
        "HEALTH_AND_WELLNESS",
        "CANNED_GOODS",
        "CONDIMENTS",
        "FROZEN",
        "OTHERS",
      ],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: {
      type: String,
      enum: [
        "KG",
        "GRAM",
        "LITRE",
        "ML",
        "PIECE",
        "PACK",
        "DOZEN",
        "BUNDLE",
        "BAG",
        "BOX",
        "CAN",
        "BOTTLE",
        "JAR",
        "TUBE",
        "TRAY",
        "PACKET",
        "SACHET",
        "ROLL",
        "BAR",
        "GALLON",
        "QUART",
        "SERVING",
        "LB",
        "OZ",
      ],
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
