"use client";

import { motion } from "motion/react";

function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6 sm:mb-8"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
        Our Products
      </h1>
      <p className="text-gray-500 text-base sm:text-lg">
        Discover fresh groceries and daily essentials
      </p>
    </motion.div>
  );
}

export default PageHeader;
