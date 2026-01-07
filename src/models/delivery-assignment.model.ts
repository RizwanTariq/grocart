import mongoose, { Model } from "mongoose";

import { IDeliveryAssignmentDB } from "@/types/models/delivery-assignment.model";
import { DELIVERY_ASSIGNMENT_STATUS } from "@/types/enums";
import "./user.model";
import "./order.model";

const deliveryOtpSchema = new mongoose.Schema(
  {
    otpHash: { type: String },
    expiresAt: { type: Date },
    attempts: { type: Number, default: 0, min: 0, max: 3 },
  },
  { _id: false }
);

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignmentDB>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    broadcastedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_ASSIGNMENT_STATUS),
      default: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED,
      required: true,
    },
    assignedAt: { type: Date },
    deliveredAt: { type: Date },
    deliveryOtp: {
      type: deliveryOtpSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

deliveryAssignmentSchema.index({ order: 1 });
deliveryAssignmentSchema.index({ assignedTo: 1 });
deliveryAssignmentSchema.index({ status: 1 });

// In case of hot-reloading in development, we check if the model already exists
const DeliveryAssignmentModel =
  (mongoose.models.DeliveryAssignment as Model<IDeliveryAssignmentDB>) ||
  mongoose.model<IDeliveryAssignmentDB>(
    "DeliveryAssignment",
    deliveryAssignmentSchema
  );

export default DeliveryAssignmentModel;
