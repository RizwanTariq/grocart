import { WithStringId } from "../helpers";
import { IProductDB } from "../models";

export type IProduct = WithStringId<IProductDB>;
