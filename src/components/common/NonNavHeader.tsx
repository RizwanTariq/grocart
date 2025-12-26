"use client";

import { motion } from "motion/react";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function NonNavHeader({
  title,
  Icon,
  subtitle,
}: {
  title: string;
  Icon?: LucideIcon;
  subtitle: string;
}) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
          </motion.button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              {Icon && (
                <div className="w-8 h-8 bg-linear-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NonNavHeader;
