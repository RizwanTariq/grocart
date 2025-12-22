import mongoose, { Model } from "mongoose";

import { IOrderDB } from "@/types/models/order.model";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PRODUCT_UNIT,
} from "@/types/enums";

const orderSchema = new mongoose.Schema<IOrderDB>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderNumber: { type: String, required: true, unique: true, index: true },

    items: [
      {
        _id: false,
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        unit: {
          type: String,
          enum: Object.values(PRODUCT_UNIT),
          required: true,
        },
      },
    ],

    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.COD,
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PAYMENT_PENDING,
      required: true,
      index: true,
    },
    stripeSessionId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      default: null,
    },
    paymentAttempts: {
      type: Number,
      default: 0,
    },
    address: {
      _id: false,
      fullName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: false, default: null },
        lng: { type: Number, required: false, default: null },
      },
    },
    expiresAt: {
      type: Date,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// In case of hot-reloading in development, we check if the model already exists
const OrderModel =
  (mongoose.models.Order as Model<IOrderDB>) ||
  mongoose.model<IOrderDB>("Order", orderSchema);

export default OrderModel;
