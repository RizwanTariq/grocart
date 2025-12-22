import { WithStringId } from "../../server/helpers";
import { IOrderDB } from "../models/order.model";

export type IOrder = WithStringId<
  IOrderDB & { isPaymentRetryAllowed: boolean }
>;

export type IOrderItem = WithStringId<IOrderDB["items"][0]>;
