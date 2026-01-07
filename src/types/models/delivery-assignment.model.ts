import mongoose from "mongoose";
import { DELIVERY_ASSIGNMENT_STATUS } from "../enums";

export interface IDeliveryAssignmentDB {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  broadcastedTo: Array<mongoose.Types.ObjectId>;
  assignedTo?: mongoose.Types.ObjectId;
  status: DELIVERY_ASSIGNMENT_STATUS;
  assignedAt?: Date;
  deliveryOtp?: {
    otpHash: string;
    expiresAt: Date;
    attempts: number;
  };
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
