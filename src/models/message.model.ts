import mongoose, { Model } from "mongoose";
import { IMessageDB } from "@/types/models/message.model";

import "./order.model";
import "./user.model";

const messageSchema = new mongoose.Schema<IMessageDB>(
  {
    chatOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    sentAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// In case of hot-reloading in development, we check if the model already exists
const MessageModel =
  (mongoose.models.Message as Model<IMessageDB>) ||
  mongoose.model<IMessageDB>("Message", messageSchema);

export default MessageModel;
