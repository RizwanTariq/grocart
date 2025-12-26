import { Types } from "mongoose";
import { USER_ROLE } from "../enums";

export interface IUserDB {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  contact?: string;
  image?: string;
  role: USER_ROLE;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  lastActiveAt?: Date;
  socketId?: string;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
