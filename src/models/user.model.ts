import mongoose, { Model } from "mongoose";
import { IUserDB } from "@/types";
import { USER_ROLE } from "@/types/enums";

const geoPointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coords: number[]) =>
          coords.length === 2 &&
          coords[0] >= -180 &&
          coords[0] <= 180 &&
          coords[1] >= -90 &&
          coords[1] <= 90,
        message: "Invalid longitude/latitude",
      },
    },
  },
  { _id: false }
);

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
    location: {
      type: geoPointSchema,
      required: false,
      index: "2dsphere",
    },
    lastActiveAt: {
      type: Date,
      index: true,
    },
    socketId: {
      type: String,
      required: false,
      index: true,
      unique: true,
      sparse: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
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
