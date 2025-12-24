"use client";

import { motion } from "motion/react";
import { Package, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

function StatsGrid({
  totalProducts,
  lowStockCount,
  outOfStockCount,
  totalValue,
}: {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
}) {
  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-100/60",
      iconBg: "bg-blue-200/60",
    },
    {
      label: "Inventory Value",
      value: `Rs. ${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-100/60",
      iconBg: "bg-emerald-200/60",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      icon: AlertCircle,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-100/60",
      iconBg: "bg-amber-200/60",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: AlertCircle,
      gradient: "from-red-500 to-pink-500",
      bg: "bg-red-100/60",
      iconBg: "bg-red-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "flex sm:flex-col justify-between gap-1",
            "rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all",
            stat.bg
          )}
        >
          <div className="flex sm:flex-col items-center sm:items-start sm:justify-between gap-2">
            <div
              className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}
            >
              <stat.icon className="w-6 h-6 text-gray-700" strokeWidth={2} />
            </div>
            <p className="text-base sm:text-sm font-medium text-gray-600">
              {stat.label}
            </p>
          </div>

          <p
            className={`text-3xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
          >
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsGrid;
