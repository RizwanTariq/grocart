import { Types } from "mongoose";

export interface IProductDB {
  _id?: Types.ObjectId;
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
