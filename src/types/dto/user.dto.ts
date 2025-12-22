import { WithStringId } from "../../server/helpers";
import { IUserDB } from "../models";

export type IUser = WithStringId<IUserDB>;
