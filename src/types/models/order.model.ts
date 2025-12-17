import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_METHOD, PRODUCT_UNIT } from "../enums";

export interface IOrderDB {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    unit: PRODUCT_UNIT;
  }[];
  total: number;
  status: ORDER_STATUS;
  paymentMethod: PAYMENT_METHOD;
  address: {
    fullName: string;
    email: string;
    phone: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}
