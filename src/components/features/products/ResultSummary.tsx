"use client";

import { motion } from "motion/react";

function ResultsSummary({
  count,
  selectedCategory,
  categoryLabel,
}: {
  count: number;
  selectedCategory: string;
  categoryLabel: string | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-4 sm:mb-6 flex items-center justify-between"
    >
      <p className="text-sm sm:text-base text-gray-600">
        <span className="font-semibold text-gray-900">{count}</span>{" "}
        {count === 1 ? "product" : "products"} found
        {selectedCategory !== "ALL" && categoryLabel && (
          <span className="text-gray-500"> in {categoryLabel}</span>
        )}
      </p>
    </motion.div>
  );
}

export default ResultsSummary;
