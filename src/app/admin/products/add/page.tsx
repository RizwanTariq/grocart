"use client";

import { CirclePlus } from "lucide-react";
import { motion } from "motion/react";

import PageHeader from "@/components/common/PageHeader";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-full max-w-3xl shadow-2xl border border-rose-100 rounded-2xl p-8 md:px-10"
        >
          <ProductForm />
        </motion.div>
      </div>
    </div>
  );
}

export default AddProductPage;
