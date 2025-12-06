// app/loading.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function LoadingPage() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ scale: 0.75 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <Loader2 className="w-12 h-12 text-rose-600 dark:text-rose-400" />
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </span>
      </motion.div>
    </motion.div>
  );
}
