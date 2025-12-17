"use client";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

function MapLoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-500 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-lg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
      >
        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-gray-700">
          Finding location
        </span>
      </motion.div>
    </motion.div>
  );
}

export default MapLoadingOverlay;
