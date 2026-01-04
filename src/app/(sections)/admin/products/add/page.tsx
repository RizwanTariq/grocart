"use client";

import { CirclePlus } from "lucide-react";

import PageHeader from "@/components/common/NonNavHeader";
import ProductForm from "../_components/ProductForm";

function AddProductPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Add Product"
        Icon={CirclePlus}
        subtitle="Fill the fields below to add your product"
      />
      <div className="flex flex-col items-center justify-center py-10 px-4 relative">
        <ProductForm />
      </div>
    </div>
  );
}

export default AddProductPage;
