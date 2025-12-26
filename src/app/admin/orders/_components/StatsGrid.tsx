import { IOrder } from "@/types";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";
import { cn } from "@/utils/cn";
import {
  Clock,
  DollarSign,
  Package,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

function StatsGrid({ orders }: { orders: IOrder[] }) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    delivered: orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length,
    revenue: orders
      .filter((o) => o.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };
  const cards = [
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
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={cn(
            "bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group",
            stat.bgColor
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                `p-3 rounded-xl group-hover:scale-110 transition-transform`,
                stat.iconBg
              )}
            >
              <stat.icon className={cn(`w-6 h-6`, stat.iconColor)} />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-start">
            <p className="text-base sm:text-sm font-semibold text-gray-600 mb-1">
              {stat.label}
            </p>
            <p
              className={cn(
                "font-bold bg-linear-to-r bg-clip-text text-transparent",
                stat.color,
                stat.isRevenue ? "text-2xl" : "text-3xl"
              )}
            >
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsGrid;
