import { WithStringId } from "../../server/helpers";
import { IProductDB } from "../models";

export type IProduct = WithStringId<IProductDB>;
