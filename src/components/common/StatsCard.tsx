"use client";

import { cn } from "@/utils/cn";
import { LucideIcon, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export type StatCard = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  iconColor: string;
  iconBg: string;
  isRevenue?: boolean;
};

type Props = {
  stat: StatCard;
  index: number;
  isTrandingUp?: boolean;
};

function StatsCard({ stat, index, isTrandingUp = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
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
        {isTrandingUp && <TrendingUp className="w-5 h-5 text-green-500" />}
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
  );
}

export default StatsCard;
