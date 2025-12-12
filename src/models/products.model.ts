import mongoose, { Model } from "mongoose";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  countInStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const productSchema = new mongoose.Schema<IProduct>(
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
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
