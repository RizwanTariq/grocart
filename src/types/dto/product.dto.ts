export interface IProduct {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  countInStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
