"use client";

import { Package, Zap, Bell, DollarSign } from "lucide-react";

import StatsCard, { StatCard } from "@/components/common/StatsCard";

function StatsGrid({
  totalDeliveries,
  activeDelivery,
  earnings,
  pendingBroadcasts,
}: {
  totalDeliveries: number;
  activeDelivery: number;
  earnings: number;
  pendingBroadcasts: number;
}) {
  const stats: StatCard[] = [
    {
      icon: Package,
      label: "Total Deliveries",
      value: totalDeliveries,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100/60",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-200/60",
    },
    {
      icon: Zap,
      label: "Active Delivery",
      value: activeDelivery,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100/60",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-200/60",
    },
    {
      icon: Bell,
      label: "New Broadcasts",
      value: pendingBroadcasts,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-100/60",
      iconColor: "text-red-600",
      iconBg: "bg-red-200/60",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `Rs. ${earnings.toLocaleString()}`,
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
