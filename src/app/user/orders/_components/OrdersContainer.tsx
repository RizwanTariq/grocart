"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Truck,
  ShoppingBag,
  Navigation,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { IOrder } from "@/types";
import { IOrderItemDB } from "@/types/models/order.model";
import { cn } from "@/utils/cn";
import { useSearchParams } from "next/navigation";

const OrdersContainer = ({ orders }: { orders: IOrder[] }) => {
  const searchParams = useSearchParams();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    searchParams.get("order_id") || null
  );
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<IOrder | null>(null);

  const getStatusConfig = (status: ORDER_STATUS) => {
    const configs = {
      [ORDER_STATUS.PENDING]: {
        icon: Clock,
        color: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Pending",
        dotColor: "bg-amber-500",
      },
      [ORDER_STATUS.OUT_FOR_DELIVERY]: {
        icon: Truck,
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Out for Delivery",
        dotColor: "bg-blue-500",
      },
      [ORDER_STATUS.DELIVERED]: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-200",
        label: "Delivered",
        dotColor: "bg-green-500",
      },
      [ORDER_STATUS.CANCELLED]: {
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Cancelled",
        dotColor: "bg-red-500",
      },
      [ORDER_STATUS.EXPIRED]: {
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Expired",
        dotColor: "bg-red-500",
      },
      [ORDER_STATUS.CONFIRMED]: {
        icon: CheckCircle,
        color: "bg-sky-100 text-sky-700 border-sky-200",
        label: "Confirmed",
        dotColor: "bg-sky-500",
      },
    };
    return configs[status] || configs[ORDER_STATUS.PENDING];
  };

  const getPaymentMethodLabel = (method: PAYMENT_METHOD) => {
    const labels = {
      [PAYMENT_METHOD.CARD]: "Card Payment",
      [PAYMENT_METHOD.COD]: "Cash on Delivery",
    };
    return labels[method] || method;
  };

  const getPaymentStatusLabel = (status: PAYMENT_STATUS) => {
    const labels = {
      [PAYMENT_STATUS.PAYMENT_PENDING]: "Pending",
      [PAYMENT_STATUS.PAYMENT_PAID]: "Paid",
      [PAYMENT_STATUS.PAYMENT_FAILED]: "Failed",
    };
    return labels[status] || status;
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalItems = (items: IOrderItemDB[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 ml-15">Track and manage your orders</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Start shopping to see your orders here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrder === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow",
                    isExpanded && "shadow-xl border border-rose-200"
                  )}
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                            <span
                              className={`w-2 h-2 mt-0.5 rounded-full ${statusConfig.dotColor} animate-pulse`}
                            ></span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(order.createdAt as Date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-gray-400" />
                            {totalItems(order.items)}{" "}
                            {totalItems(order.items) === 1 ? "item" : "items"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          Rs. {order.totalAmount.toLocaleString()}
                        </div>
                        <div
                          className={`text-sm font-semibold mt-1 ${
                            order.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID
                              ? "text-green-600"
                              : order.paymentStatus ===
                                PAYMENT_STATUS.PAYMENT_FAILED
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </div>
                        <div>
                          {order.isPaymentRetryAllowed && (
                            <button
                              onClick={() => null}
                              className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                              Retry Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-xl border-2 border-white bg-linear-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xs font-bold text-rose-700 shadow-sm">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <button className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer">
                        {isExpanded ? (
                          <>
                            Hide Details <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View Details <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6 bg-linear-to-br from-gray-50 to-rose-50/30">
                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-4 h-4 text-rose-600" />
                                </div>
                                <h4 className="font-bold text-gray-900">
                                  Order Items
                                </h4>
                              </div>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-gray-900 mb-1 truncate">
                                        {item.name}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Rs. {item.price.toLocaleString()} each
                                      </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="font-bold text-gray-900 text-lg">
                                        Rs.{" "}
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString()}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <h4 className="font-bold text-gray-900">
                                    Delivery Address
                                  </h4>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 text-sm">
                                  <p className="font-semibold text-gray-900">
                                    {order.address.fullName}
                                  </p>
                                  <p className="flex items-start gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                                    <span>
                                      {order.address.fullAddress}
                                      <br />
                                      {order.address.city},{" "}
                                      {order.address.postalCode}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {order.address.phone}
                                  </p>
                                  <p className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {order.address.email}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                  </div>
                                  <h4 className="font-bold text-gray-900">
                                    Payment Details
                                  </h4>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                      Payment Method
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {getPaymentMethodLabel(
                                        order.paymentMethod
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                      Payment Status
                                    </span>
                                    <span
                                      className={`font-semibold px-2 py-1 rounded-lg text-xs ${
                                        order.paymentStatus === "PAYMENT_PAID"
                                          ? "bg-green-100 text-green-700"
                                          : order.paymentStatus ===
                                            "PAYMENT_FAILED"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {getPaymentStatusLabel(
                                        order.paymentStatus
                                      )}
                                    </span>
                                  </div>
                                  <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-gray-900">
                                        Total Amount
                                      </span>
                                      <span className="font-bold text-xl bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                        Rs. {order.totalAmount.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>

                            {order.status === ORDER_STATUS.OUT_FOR_DELIVERY ? (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-3"
                              >
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                  <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900 mb-1">
                                      Your order is out for delivery!
                                    </p>
                                    <p className="text-xs text-blue-700">
                                      Track your delivery in real-time
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openTrackingModal(order);
                                  }}
                                  className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                  <Navigation className="w-5 h-5" />
                                  Track Live Delivery
                                </button>
                              </motion.div>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
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
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={closeTrackingModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          Live Delivery Tracking
                        </h3>
                        <p className="text-sm text-blue-100">
                          {selectedOrderForTracking.orderNumber}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeTrackingModal}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Delivery in progress</span>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Delivery Status Card */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Delivery to
                          </p>
                          <p className="font-semibold text-gray-900">
                            {selectedOrderForTracking.address.fullName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedOrderForTracking.address.fullAddress}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">
                            Estimated arrival
                          </p>
                          <p className="font-bold text-blue-600">15-20 mins</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedOrderForTracking.address.phone}</span>
                      </div>
                    </div>

                    {/* Map Container - Replace this div with your actual Map component */}
                    <div
                      className="bg-gray-100 rounded-xl overflow-hidden"
                      style={{ height: "400px" }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {/* Replace this with your Map component */}
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="font-semibold">
                            Your Map Component Goes Here
                          </p>
                          <p className="text-sm mt-1">
                            Import and use your map component to show live
                            tracking
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Boy Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          DB
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            Delivery Partner
                          </p>
                          <p className="text-sm text-gray-600">
                            On the way to your location
                          </p>
                        </div>
                        <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                          <Phone className="w-5 h-5 text-green-600" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Items (
                        {totalItems(selectedOrderForTracking.items)})
                      </h4>
                      <div className="space-y-2">
                        {selectedOrderForTracking.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              Rs.{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          Total Amount
                        </span>
                        <span className="font-bold text-lg text-rose-600">
                          Rs.{" "}
                          {selectedOrderForTracking.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersContainer;
