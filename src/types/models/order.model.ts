import mongoose from "mongoose";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PRODUCT_UNIT,
} from "../enums";

export interface IOrderItemDB {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: PRODUCT_UNIT;
}

export interface IOrderDB {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItemDB[];
  totalAmount: number;
  status: ORDER_STATUS;
  paymentMethod: PAYMENT_METHOD;
  paymentStatus: PAYMENT_STATUS;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  paymentAttempts?: number;
  address: {
    fullName: string;
    email: string;
    phone: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    coordinates: {
      lat: number | null;
      lng: number | null;
    };
  };
  expiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
