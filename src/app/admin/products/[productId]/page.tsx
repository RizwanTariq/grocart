import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { convertId, IProduct } from "@/types";
import UpdateWrapper from "./_components/UpdateWrapper";

async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;
  await connectDB();

  const _product = await ProductModel.findById(productId).lean();
  const product = convertId(_product) as IProduct;

  if (!product) {
    throw new Error("Product not found");
  }
  return <UpdateWrapper product={product} />;
}

export default EditProductPage;
