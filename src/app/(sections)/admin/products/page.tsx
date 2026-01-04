import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { convertIds, IProduct } from "@/types";
import AdminProductsList from "./_components/AdminProductsList";

async function AdminProductsPage() {
  await connectDB();
  const _products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  const products = convertIds(_products) as IProduct[];

  return <AdminProductsList products={products} />;
}

export default AdminProductsPage;
