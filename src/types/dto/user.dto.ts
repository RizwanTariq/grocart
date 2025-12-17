import { WithStringId } from "../helpers";
import { IUserDB } from "../models";

export type IUser = WithStringId<IUserDB>;
