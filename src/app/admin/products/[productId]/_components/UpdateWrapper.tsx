"use client";

import { Pencil } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import { IProduct } from "@/types";
import ProductForm from "../../_components/ProductForm";

function UpdateWrapper({ product }: { product: IProduct }) {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Edit Product"
        Icon={Pencil}
        subtitle="Update the fields below to edit this product"
      />
      <div className="flex flex-col items-center justify-center py-10 px-4 relative">
        <ProductForm product={product} />
      </div>
    </div>
  );
}

export default UpdateWrapper;
