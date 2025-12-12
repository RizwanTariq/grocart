import mongoose, { Model } from "mongoose";
import { IUserDB } from "@/types";

export const userSchema = new mongoose.Schema<IUserDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    contact: { type: String, required: false },
    image: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "delivery_boy", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// In case of hot-reloading in development, we check if the model already exists
const UserModel =
  (mongoose.models.User as Model<IUserDB>) ||
  mongoose.model<IUserDB>("User", userSchema);

export default UserModel;
