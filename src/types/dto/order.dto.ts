import { WithStringId } from "../helpers";
import { IOrderDB } from "../models/order.model";

export type IOrder = WithStringId<IOrderDB>;

export type IOrderItem = WithStringId<IOrderDB["items"][0]>;
