"use client";

import { Package } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

function NoOrdersCard() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md sm:max-w-2xl w-full bg-white rounded-2xl shadow-lg text-center p-12 flex flex-col gap-1 items-center"
    >
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
        <Package className="w-10 h-10 text-rose-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
      <p className="text-gray-600">Start shopping to see your orders here</p>
      <button
        onClick={() => router.replace("/user/products")}
        className="w-full max-w-xs mt-5 bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-2 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
      >
        Start Shopping
      </button>
    </motion.div>
  );
}

export default NoOrdersCard;
