import { Types } from "mongoose";

export interface IUserDB {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  contact?: string;
  image?: string;
  role: "user" | "delivery_boy" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
