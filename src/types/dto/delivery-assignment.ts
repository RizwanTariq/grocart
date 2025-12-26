import { WithStringId } from "@/server/helpers";
import { IDeliveryAssignmentDB } from "../models/delivery-assignment.model";

export type IDeliveryAssignment = WithStringId<IDeliveryAssignmentDB>;
