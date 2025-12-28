import { WithStringId } from "../../server/helpers";
import { Populate } from "../generic";
import { IOrderDB } from "../models/order.model";
import { IUser } from "./user.dto";

export type IOrder = WithStringId<
  IOrderDB & { isPaymentRetryAllowed: boolean }
>;

export type IOrderItem = WithStringId<IOrderDB["items"][0]>;

export type IOrderPopulated = Populate<IOrder, "user", IUser>;
