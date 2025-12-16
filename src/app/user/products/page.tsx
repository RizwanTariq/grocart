import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { convertIds, IProduct } from "@/types";
import ProductsContainer from "./_components/ProductsContainer";
import NavBar from "@/components/features/navbar/NavBar";

async function ProductsPage() {
  await connectDB();
  const _products = await ProductModel.find().lean();
  const products = convertIds(_products) as IProduct[];

  return (
    <>
      <NavBar />
      <ProductsContainer products={products} />
    </>
  );
}

export default ProductsPage;
