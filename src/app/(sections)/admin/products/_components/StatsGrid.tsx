"use client";

import { Package, TrendingUp, AlertCircle } from "lucide-react";

import StatsCard, { StatCard } from "@/components/common/StatsCard";

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
  const stats: StatCard[] = [
    {
      icon: Package,
      label: "Total Products",
      value: totalProducts,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100/60",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-200/60",
    },
    {
      icon: AlertCircle,
      label: "Low Stock Items",
      value: lowStockCount,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100/60",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-200/60",
    },
    {
      icon: AlertCircle,
      label: "Out of Stock",
      value: outOfStockCount,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-100/60",
      iconColor: "text-red-600",
      iconBg: "bg-red-200/60",
    },
    {
      icon: TrendingUp,
      label: "Inventory Value",
      value: `Rs. ${totalValue.toLocaleString()}`,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100/60",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-200/60",
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatsCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

export default StatsGrid;
