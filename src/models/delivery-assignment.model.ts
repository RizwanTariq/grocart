import mongoose, { Model } from "mongoose";

import { IDeliveryAssignmentDB } from "@/types/models/delivery-assignment.model";
import { DELIVERY_ASSIGNMENT_STATUS } from "@/types/enums";

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignmentDB>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    broadcastedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_ASSIGNMENT_STATUS),
      default: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED,
      required: true,
    },
    assignedAt: { type: Date, required: false },
    deliveredAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// In case of hot-reloading in development, we check if the model already exists
const DeliveryAssignmentModel =
  (mongoose.models.DeliveryAssignment as Model<IDeliveryAssignmentDB>) ||
  mongoose.model<IDeliveryAssignmentDB>(
    "DeliveryAssignment",
    deliveryAssignmentSchema
  );

export default DeliveryAssignmentModel;
