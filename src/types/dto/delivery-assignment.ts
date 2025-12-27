import { WithStringId } from "@/server/helpers";
import { IDeliveryAssignmentDB } from "../models/delivery-assignment.model";
import { Populate } from "../generic";
import { IUser } from "./user.dto";
import { IOrder } from "./order.dto";

export type IDeliveryAssignment = WithStringId<IDeliveryAssignmentDB>;

export type IDeliveryAssignmentPopulated = Populate<
  Populate<IDeliveryAssignment, "order", IOrder>,
  "assignedTo",
  IUser | null
>;
