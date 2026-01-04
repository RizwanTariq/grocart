import StatsCard, { StatCard } from "@/components/common/StatsCard";
import { IOrder } from "@/types";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";

import { Clock, DollarSign, Package, PackageCheck } from "lucide-react";

function StatsGrid({ orders }: { orders: IOrder[] }) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    delivered: orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length,
    revenue: orders
      .filter((o) => o.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };
  const cards: StatCard[] = [
    {
      icon: Package,
      label: "Total Orders",
      value: stats.total,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100/60",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-200/60",
    },
    {
      icon: Clock,
      label: "Pending Orders",
      value: stats.pending,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100/60",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-200/60",
    },
    {
      icon: PackageCheck,
      label: "Delivered",
      value: stats.delivered,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100/60",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-200/60",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `Rs. ${stats.revenue.toLocaleString()}`,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-100/60",
      iconColor: "text-red-600",
      iconBg: "bg-red-200/60",
      isRevenue: true,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cards.map((stat, idx) => (
        <StatsCard key={idx} stat={stat} index={idx} />
      ))}
    </div>
  );
}

export default StatsGrid;
