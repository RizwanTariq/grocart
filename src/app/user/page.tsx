import connectDB from "@/libs/db";
import ProductModel from "@/models/products.model";
import { convertIds, IProduct } from "@/types";
import ProductCard from "@/components/ProductCard";

import CategorySlider from "./_components/CategorySlider";
import HeroSection from "./_components/HeroSection";

export default async function UserHome() {
  await connectDB();
  const _products = await ProductModel.find().lean();
  const products = convertIds(_products) as IProduct[];

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[84%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-700 mb-6 text-center">
          🎊 Our Popular Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
