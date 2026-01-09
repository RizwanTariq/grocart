"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  LayoutDashboard,
  LoaderCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import Dropdown from "@/components/common/Dropdown";
import axios from "axios";
import SecondaryStats from "./_components/SecondaryStats";
import StatsGrid from "./_components/StatsGrid";

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  lowStockProducts: number;
  activeDeliveries: number;
  totalCustomers: number;
  avgOrderValue: number;
  deliveryRate: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  products: number;
  percentage: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

const AdminDashboard = () => {
  const [isPending, startTransition] = useTransition();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    activeDeliveries: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    deliveryRate: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      startTransition(async () => {
        const response = await axios.get(
          `/api/admin/analytics?range=${timeRange}`
        );
        const data = response.data;

        setStats(data.stats);
        setRevenueData(data.revenueData);
        setCategoryData(data.categoryData);
        setOrderStatusData(data.orderStatusData);
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const COLORS = {
    rose: "#f43f5e",
    pink: "#ec4899",
    roseLight: "#ffe4e6",
    pinkLight: "#fce7f3",
    gradient: [
      "#f43f5e",
      "#ec4899",
      "#db2777",
      "#be185d",
      "#9d174d",
      "#7f1d46",
      "#5f1d3f",
      "#ffe4e6",
      "#fce7f3",
      "#3e1d39",
      "#1f1d34",
      "#000000",
    ],
  };

  const timeRangeOptions = [
    { label: "Last 7 Days", id: "7d" },
    { label: "Last 30 Days", id: "30d" },
    { label: "Last 90 Days", id: "90d" },
  ];
  const [showDropdown, setShowDropdown] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard Overview"
          subTitle="Monitor your business performance and analytics"
        >
          <div className="flex items-center">
            <Dropdown
              isOpen={showDropdown}
              selectedLabel={
                timeRangeOptions.find((option) => option.id === timeRange)
                  ?.label
              }
              selectedId={timeRange}
              onSelect={(id) => {
                setTimeRange(id as "7d" | "30d" | "90d");
                setShowDropdown(false);
              }}
              onToggle={() => setShowDropdown((prev) => !prev)}
              list={timeRangeOptions}
            />
          </div>
        </PageHeader>

        <StatsGrid stats={stats} />

        <SecondaryStats stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-rose-600" />
                  Revenue Trend
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Daily revenue over time
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.roseLight}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.rose}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.rose}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-rose-600" />
                  Sales by Category
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Product category breakdown
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData as unknown as Record<string, unknown>[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(label) =>
                    `${label.name} ${
                      (label as unknown as CategoryData).percentage || 0
                    }%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.gradient[index % COLORS.gradient.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    color: "gray",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                Order Status Overview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Current order distribution by status
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="status"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.gradient[index % COLORS.gradient.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
