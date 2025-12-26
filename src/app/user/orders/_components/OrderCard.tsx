"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Package,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Truck,
  Navigation,
} from "lucide-react";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/types/enums";
import { IOrder } from "@/types";
import { cn } from "@/utils/cn";
import {
  formatDate,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getStatusConfig,
  totalItems,
} from "./utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { extractApiError } from "@/utils/api-error-extractor";
import toast from "react-hot-toast";

function OrderCard({
  order,
  index,
  expandedOrder,
  toggleOrder,
  openTrackingModal,
}: {
  order: IOrder;
  index: number;
  expandedOrder: string | null;
  toggleOrder: (orderId: string) => void;
  openTrackingModal: (order: IOrder) => void;
}) {
  const router = useRouter();
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const isExpanded = expandedOrder === order._id;

  const handleRetryPayment = async () => {
    try {
      const res = await axios.post(`/api/user/orders/${order._id}/retry`);
      if (res.status === 200) {
        window.location.href = res.data.paymentRedirectUrl;
      }
    } catch (err: unknown) {
      const error = extractApiError(err);
      if (error) {
        if (error.code === "PAYMENT_FAILED")
          router.replace(`/user/orders/cancel?order_id=${error.orderId}`);
        toast.error(error.message);
      }
    }
  };

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

              {order.isPaymentRetryAllowed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetryPayment();
                  }}
                  className="text-sm font-semibold bg-blue-100 px-3.5 py-1.5 rounded-full text-blue-600 hover:shadow-lg hover:bg-blue-200/80 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Retry Payment
                </button>
              )}
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
                  : order.paymentStatus === PAYMENT_STATUS.PAYMENT_FAILED
                  ? "text-red-600"
                  : "text-amber-600"
              }`}
            >
              {getPaymentStatusLabel(order.paymentStatus)}
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
                    <h4 className="font-bold text-gray-900">Order Items</h4>
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
                            Rs. {(item.price * item.quantity).toLocaleString()}
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
                          {order.address.city}, {order.address.postalCode}
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
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-900">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Status</span>
                        <span
                          className={`font-semibold px-2 py-1 rounded-lg text-xs ${
                            order.paymentStatus === "PAYMENT_PAID"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "PAYMENT_FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
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
}

export default OrderCard;
