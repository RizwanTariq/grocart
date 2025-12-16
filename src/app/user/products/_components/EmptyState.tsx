"use client";

import { Search } from "lucide-react";
import { motion } from "motion/react";

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <motion.div
      key="no-results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12 sm:py-16 px-4"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        No products found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        Try adjusting your filters or search query
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClearFilters}
        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-medium shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
      >
        Clear all filters
      </motion.button>
    </motion.div>
  );
}

export default EmptyState;
