import mongoose, { Model } from "mongoose";

import { IOrderDB } from "@/types/models/order.model";
import { ORDER_STATUS, PAYMENT_METHOD, PRODUCT_UNIT } from "@/types/enums";

const orderSchema = new mongoose.Schema<IOrderDB>(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: {
          type: String,
          enum: Object.values(PRODUCT_UNIT),
          required: true,
        },
      },
    ],

    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.COD,
      required: true,
    },
    address: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
      },
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
