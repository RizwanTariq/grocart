import mongoose from "mongoose";

export interface IMessageDB {
  _id?: mongoose.Types.ObjectId;
  chatOrder: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  sentAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
