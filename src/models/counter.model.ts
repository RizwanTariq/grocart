import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICounter extends Document {
  name: string; // e.g. order-20251218
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel =
  (mongoose.models.Counter as Model<ICounter>) ||
  mongoose.model<ICounter>("Counter", CounterSchema);

export default CounterModel;
