"use client";

import { motion } from "motion/react";

function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  showFilters,
}: {
  categories: Array<{ id: string; label: string }>;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  showFilters: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`mb-4 sm:mb-8 ${showFilters ? "block" : "hidden sm:block"}`}
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all shadow-sm ${
              selectedCategory === category.id
                ? "bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-rose-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 cursor-pointer"
            }`}
          >
            {category.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default CategoryFilters;
