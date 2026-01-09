"use client";
import { DollarSign, Package, ShoppingCart, Truck } from "lucide-react";
import { DashboardStats } from "./AdminDashboard";
import StatsCard from "@/components/common/StatsCard";

function StatsGrid({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      label: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      isRevenue: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Active Deliveries",
      value: stats.activeDeliveries.toLocaleString(),
      change: 0,
      icon: Truck,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: 0,
      icon: Package,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, idx) => (
        <StatsCard key={idx} stat={stat} index={idx} />
      ))}
    </div>
  );
}

export default StatsGrid;
