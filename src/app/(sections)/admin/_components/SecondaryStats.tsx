"use client";

import {
  Activity,
  AlertCircle,
  LucideIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";
import { DashboardStats } from "../page";

function SecondaryStats({ stats }: { stats: DashboardStats }) {
  const secondaryStats = [
    {
      label: "Avg Order Value",
      value: `Rs. ${stats.avgOrderValue.toLocaleString()}`,
      icon: Activity as LucideIcon,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      borderColor: "ring-rose-600/30",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users as LucideIcon,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      borderColor: "ring-blue-600/30",
    },
    {
      label: "Delivery Rate",
      value: `${stats.deliveryRate}%`,
      icon: TrendingUp as LucideIcon,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      borderColor: "ring-green-600/30",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockProducts.toLocaleString(),
      icon: AlertCircle as LucideIcon,
      iconColor:
        stats.lowStockProducts > 0 ? "text-orange-600" : "text-gray-600",
      iconBg: stats.lowStockProducts > 0 ? "bg-orange-100" : "bg-gray-100",
      borderColor:
        stats.lowStockProducts > 0 ? "ring-orange-600/30" : "ring-gray-600/30",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {secondaryStats.map((stat, idx) => (
        <div
          key={idx}
          className={cn(
            `bg-white rounded-2xl p-4 ring-2 shadow-lg`,
            stat.borderColor
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(`p-2 rounded-lg`, stat.iconBg)}>
              <stat.icon className={cn(`w-5 h-5`, stat.iconColor)} />
            </div>
            <div>
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default SecondaryStats;
