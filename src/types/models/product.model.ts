import { Types } from "mongoose";
import { PRODUCT_CATEGORY, PRODUCT_UNIT } from "../enums";

export interface IProductDB {
  _id?: Types.ObjectId;
  name: string;
  category: PRODUCT_CATEGORY;
  description: string;
  price: number;
  unit: PRODUCT_UNIT;
  image: string;
  countInStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
