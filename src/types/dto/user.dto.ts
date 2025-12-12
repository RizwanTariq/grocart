export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  contact?: string;
  image?: string;
  role: "user" | "delivery_boy" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
