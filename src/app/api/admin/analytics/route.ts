import { NextResponse } from "next/server";
import OrderModel from "@/models/order.model";
import ProductModel from "@/models/products.model";
import UserModel from "@/models/user.model";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  USER_ROLE,
  DELIVERY_ASSIGNMENT_STATUS,
} from "@/types/enums";
import { auth } from "@/auth";
import { categories } from "@/constants/product";

export const GET = auth(async function (request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Fetch orders within range
    const orders = await OrderModel.find({
      createdAt: { $gte: startDate },
    }).lean();

    const previousPeriodStart = new Date(
      startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000
    );
    const previousOrders = await OrderModel.find({
      createdAt: { $gte: previousPeriodStart, $lt: startDate },
    }).lean();

    // Calculate stats
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const previousRevenue = previousOrders
      .filter((o) => o.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueChange = previousRevenue
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const totalOrders = orders.length;
    const ordersChange = previousOrders.length
      ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
      : 0;

    // Product stats
    const totalProducts = await ProductModel.countDocuments();
    const lowStockProducts = await ProductModel.countDocuments({
      countInStock: { $lt: 30 },
    });

    // Active deliveries
    const activeDeliveries = await DeliveryAssignmentModel.countDocuments({
      status: {
        $in: [DELIVERY_ASSIGNMENT_STATUS.ASSIGNED],
      },
    });

    // Total customers
    const totalCustomers = await UserModel.countDocuments({
      role: USER_ROLE.USER,
    });

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Delivery rate (percentage of delivered orders)
    const deliveredOrders = orders.filter(
      (o) => o.status === ORDER_STATUS.DELIVERED
    ).length;
    const deliveryRate =
      totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // Revenue data for chart (daily breakdown)
    const revenueData = [];
    const dateMap = new Map();

    orders.forEach((order) => {
      if (order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID) {
        const date = new Date(order.createdAt!).toISOString().split("T")[0];
        const existing = dateMap.get(date) || { revenue: 0, orders: 0 };
        dateMap.set(date, {
          revenue: existing.revenue + order.totalAmount,
          orders: existing.orders + 1,
        });
      }
    });

    // Fill in missing dates
    for (let i = 0; i < daysAgo; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const data = dateMap.get(dateStr) || { revenue: 0, orders: 0 };
      revenueData.unshift({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: data.revenue,
        orders: data.orders,
      });
    }

    // Category data for pie chart
    const categoryMap = new Map();
    const allProducts = await ProductModel.find().lean();

    allProducts.forEach((product) => {
      const existing = categoryMap.get(product.category) || {
        value: 0,
        products: 0,
      };
      categoryMap.set(product.category, {
        value: existing.value + product.price * product.countInStock,
        products: existing.products + 1,
      });
    });

    const categoryData = Array.from(categoryMap.entries()).map(
      ([name, data]) => ({
        name: categories.find((c) => c.id === name)?.label || "Others",
        value: data.value,
        products: data.products,
        percentage: 0, // Will calculate after
      })
    );

    const totalCategoryValue = categoryData.reduce(
      (sum, cat) => sum + cat.value,
      0
    );
    categoryData.forEach((cat) => {
      cat.percentage = totalCategoryValue
        ? Math.round((cat.value / totalCategoryValue) * 100)
        : 0;
    });

    // Order status data for bar chart
    const orderStatusData = [
      {
        status: "Pending",
        count: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
        percentage: 0,
      },
      {
        status: "Confirmed",
        count: orders.filter((o) => o.status === ORDER_STATUS.CONFIRMED).length,
        percentage: 0,
      },
      {
        status: "Out for Delivery",
        count: orders.filter((o) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY)
          .length,
        percentage: 0,
      },
      {
        status: "Delivered",
        count: orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length,
        percentage: 0,
      },
      {
        status: "Cancelled",
        count: orders.filter((o) => o.status === ORDER_STATUS.CANCELLED).length,
        percentage: 0,
      },
    ];

    orderStatusData.forEach((status) => {
      status.percentage = totalOrders
        ? Math.round((status.count / totalOrders) * 100)
        : 0;
    });

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue),
        revenueChange: Math.round(revenueChange * 10) / 10,
        totalOrders,
        ordersChange: Math.round(ordersChange * 10) / 10,
        totalProducts,
        lowStockProducts,
        activeDeliveries,
        totalCustomers,
        avgOrderValue: Math.round(avgOrderValue),
        deliveryRate: Math.round(deliveryRate * 10) / 10,
      },
      revenueData,
      categoryData: categoryData.slice(0, 5), // Top 5 categories
      orderStatusData,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
});
