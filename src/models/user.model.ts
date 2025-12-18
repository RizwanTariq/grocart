import mongoose, { Model } from "mongoose";
import { IUserDB } from "@/types";
import { USER_ROLE } from "@/types/enums";

export const userSchema = new mongoose.Schema<IUserDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    contact: { type: String, required: false },
    image: { type: String, required: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
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
