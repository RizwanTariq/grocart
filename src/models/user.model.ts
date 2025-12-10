import mongoose, { Model } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  contact?: string;
  image?: string;
  role: "user" | "delivery_boy" | "admin";
}

export const userSchema = new mongoose.Schema<IUser>(
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
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default UserModel;
