import { Connection } from "mongoose";

declare global {
  var mongoose: {
    conn: Connection | typeof import("mongoose") | null;
    promise: Promise<Connection | typeof import("mongoose")> | null;
  };
}

export {};
