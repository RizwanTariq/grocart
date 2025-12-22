import { Types } from "mongoose";

export type WithStringId<T> = Omit<T, "_id"> & { _id: string };

export function convertId<T extends { _id?: Types.ObjectId }>(
  doc: T | null
): WithStringId<T> | null {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id ? doc._id.toHexString() : "",
  };
}

export function convertIds<T extends { _id?: Types.ObjectId }>(
  docs: T[]
): WithStringId<T>[] {
  return docs.map((d) => ({
    ...d,
    _id: d._id ? d._id.toHexString() : "",
  }));
}
