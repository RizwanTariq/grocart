"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  Package,
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  CreditCard,
  AlertCircle,
  Banknote,
  User,
  ShoppingBag,
} from "lucide-react";
import { IOrder } from "@/types";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";

import StatsGrid from "./StatsGrid";
import {
  formatDate,
  getStatusConfig,
  totalItems,
} from "@/app/user/orders/_components/utils";

import StatusFilterSelector from "./StatusFilterSelector";
import PaymentFilterSelector from "./PaymentFilterSelector";
import SearchInput from "@/components/features/products/SearchInput";
import OrderStatusSelector from "./OrderStatusSelector";
import PaymentStatusSelector from "./PaymentStatusSelector";
import PageHeader from "@/components/PageHeader";
import ExpandedCard from "./ExpandedCard";
import TrackingCard from "@/components/features/orders/TrackingCard";
import NoOrdersCard from "./NoOrdersCard";

const AdminOrdersPage = ({ _orders = [] }: { _orders: IOrder[] }) => {
  const [orders, setOrders] = useState<IOrder[]>(_orders);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ORDER_STATUS | "ALL">("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PAYMENT_STATUS | "ALL">(
    "ALL"
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<IOrder | null>(null);

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.address.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.address.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter !== "ALL") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentFilter
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: ORDER_STATUS
  ) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    newStatus: PAYMENT_STATUS
  ) => {
    try {
      setUpdatingPayment(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, paymentStatus: newStatus }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const openTrackingModal = (order: IOrder) => {
    setSelectedOrderForTracking(order);
    setTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setTrackingModalOpen(false);
    setSelectedOrderForTracking(null);
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          icon={ShoppingBag}
          title="Order Management"
          subTitle="Track and manage all customer orders"
        />

        {/* Stats Cards */}
        <StatsGrid orders={orders} />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SearchInput
              value={searchTerm}
              placeholder="Search orders, customer, phone..."
              onChange={setSearchTerm}
              onClear={() => setSearchTerm("")}
            />

            <StatusFilterSelector
              onStatusSelect={setStatusFilter}
              selectedStatus={statusFilter}
            />
            <PaymentFilterSelector
              onSelect={setPaymentFilter}
              selected={paymentFilter}
            />
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-600">
              Showing{" "}
              <span className="text-gray-900 font-bold">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 font-bold">{orders.length}</span>{" "}
              orders
            </span>
            {(searchTerm ||
              statusFilter !== "ALL" ||
              paymentFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setPaymentFilter("ALL");
                }}
                className="text-sm text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <NoOrdersCard
            description={
              searchTerm || statusFilter !== "ALL" || paymentFilter !== "ALL"
                ? "Try adjusting your filters"
                : "Orders will appear here once customers place them"
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrder === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    isExpanded ? "ring-2 ring-rose-200" : ""
                  }`}
                >
                  <div
                    className="p-4 md:p-6 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                            <span
                              className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}
                            ></span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(order.createdAt as Date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-gray-400" />
                            {order.address.fullName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {order.address.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-gray-400" />
                            {totalItems(order.items)} items
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between lg:justify-end gap-4">
                        <div className="text-left lg:text-right">
                          <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            Rs. {order.totalAmount.toLocaleString()}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mt-2 ${
                              order.paymentMethod === PAYMENT_METHOD.COD
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.paymentMethod === PAYMENT_METHOD.COD ? (
                              <Banknote className="w-3.5 h-3.5" />
                            ) : (
                              <CreditCard className="w-3.5 h-3.5" />
                            )}
                            {order.paymentMethod}
                          </span>
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer lg:ml-4">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                          Order Status
                        </label>
                        <OrderStatusSelector
                          order={order}
                          loading={updatingStatus === order._id}
                          updateOrderStatus={updateOrderStatus}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                          Payment Status
                        </label>
                        <PaymentStatusSelector
                          order={order}
                          loading={updatingPayment === order._id}
                          updatePaymentStatus={updatePaymentStatus}
                        />
                        {order.paymentMethod !== PAYMENT_METHOD.COD && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            Auto-managed by payment gateway
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <ExpandedCard
                        order={order}
                        openTrackingModal={openTrackingModal}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Live Tracking Modal */}
        <AnimatePresence>
          {trackingModalOpen && selectedOrderForTracking && (
            <TrackingCard
              order={selectedOrderForTracking}
              closeTrackingModal={closeTrackingModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
