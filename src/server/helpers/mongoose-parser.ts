import "server-only";

import { Types } from "mongoose";

export function castIdToObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
