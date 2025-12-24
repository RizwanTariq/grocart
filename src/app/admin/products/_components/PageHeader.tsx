"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import Link from "next/link";

function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text mb-2 sm:mb-3">
            Product Inventory
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Manage and monitor your product catalog
          </p>
        </div>
        <Link href="/admin/products/add">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-200 cursor-pointer hover:shadow-xl hover:shadow-rose-300 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add New Product
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default PageHeader;
