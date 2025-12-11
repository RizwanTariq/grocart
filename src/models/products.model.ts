import mongoose, { Model } from "mongoose";

interface IProduct {
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
        "Vegetables",
        "Fruits",
        "Meat",
        "Dairy & Eggs",
        "Grains",
        "Seafood",
        "Spices",
        "Beverages",
        "Snacks",
        "Personal Care",
        "Household Essentials",
        "Packaged Food",
        "Baby Care",
        "Pet Care",
        "Health & Wellness",
        "Bakery",
        "Canned Goods",
        "Condiments",
        "Frozen",
        "Others",
      ],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
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
