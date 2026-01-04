import { WithStringId } from "@/server/helpers";
import { IMessageDB } from "../models/message.model";
import { Populate } from "../generic";

import { IUser } from "./user.dto";
import { IOrder } from "./order.dto";

export type IMessage = WithStringId<IMessageDB>;

export type IMessagePopulated = Populate<
  Populate<IMessage, "chatOrder", IOrder>,
  "sender",
  IUser
>;
