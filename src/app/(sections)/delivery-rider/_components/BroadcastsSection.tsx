import { PAYMENT_METHOD } from "@/types/enums";
import {
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";

import { formatDate, totalItems } from "@/components/utils";
import { IDeliveryAssignmentPopulated } from "@/types/dto/delivery-assignment";
import { useState } from "react";
import toast from "react-hot-toast";

function BroadcastsSection({
  deliveryBroadcasts,
  onAcceptAction,
  onRejectAction,
}: {
  deliveryBroadcasts: IDeliveryAssignmentPopulated[];
  onAcceptAction: (
    assignmentId: string,
    delivery: IDeliveryAssignmentPopulated
  ) => void;
  onRejectAction: (assignmentId: string) => void;
}) {
  const [accepting, setAccepting] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const acceptDelivery = async (assignmentId: string) => {
    try {
      setAccepting(assignmentId);
      const response = await axios.post(
        `/api/delivery-rider/assignments/${assignmentId}/accept`
      );

      if (response.status === 200) {
        onAcceptAction(assignmentId, response.data);
        toast.success(`Delivery request accepted successfully!`);
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
    } finally {
      setAccepting(null);
    }
  };

  const rejectDelivery = async (assignmentId: string) => {
    try {
      setRejecting(assignmentId);
      const response = await axios.post(
        `/api/delivery-rider/assignments/${assignmentId}/reject`
      );

      if (response.status === 200) {
        onRejectAction(assignmentId);
        toast.success(`Delivery request rejected successfully!`);
      }
    } catch (error) {
      console.error("Error rejecting delivery:", error);
    } finally {
      setRejecting(null);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            New Delivery Requests
          </h2>
          <p className="text-sm text-gray-600">
            {deliveryBroadcasts.length}{" "}
            {deliveryBroadcasts.length === 1 ? "order" : "orders"} waiting for
            acceptance
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {deliveryBroadcasts.map((broadcast, idx) => (
          <motion.div
            key={broadcast._id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: idx * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="relative group"
          >
            {/* Animated border glow */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-rose-300 via-pink-300 to-orange-300 rounded-2xl opacity-30 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-500 animate-pulse" />

            <div className="relative bg-white rounded-2xl p-6 md:p-7">
              {/* Animated background orbs */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>

              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold bg-linear-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-orange-500/50"
              >
                <Bell className="w-4 h-4" />
              </motion.span>
              <div className="relative">
                {/* Header with badges */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        #{broadcast.order.orderNumber}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          broadcast.order.paymentMethod === PAYMENT_METHOD.CARD
                            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-linear-to-r from-orange-400 to-amber-500 text-white"
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {broadcast.order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDate(broadcast.createdAt as Date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Package className="w-4 h-4 text-gray-400" />
                        {totalItems(broadcast.order.items)} items
                      </span>
                    </div>
                  </div>
                </div>

                {/* Earnings Banner */}
                <div className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-600 rounded-xl px-4 py-3 mb-5 shadow-lg shadow-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-100 mb-0.5">
                          Your Earning
                        </p>
                        <p className="text-xl font-bold text-white">
                          Rs. {Math.round(broadcast.order.totalAmount * 0.1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-100 mb-0.5">
                        Order Total
                      </p>
                      <p className="text-xl font-bold text-white">
                        Rs. {broadcast.order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Info Card */}
                <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 mb-5 border border-gray-200/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-linear-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900">
                      Customer Details
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Customer Name
                        </p>
                        <p className="font-semibold text-gray-900 truncate">
                          {broadcast.order.address.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Phone Number
                        </p>
                        <p className="font-semibold text-gray-900">
                          {broadcast.order.address.phone}
                        </p>
                      </div>
                      <a
                        href={`tel:${broadcast.order.address.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                      </a>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Delivery Address
                        </p>
                        <p className="font-medium text-gray-900 text-sm leading-relaxed">
                          {broadcast.order.address.fullAddress},{" "}
                          {broadcast.order.address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 mb-5 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Order Items</h4>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {totalItems(broadcast.order.items)} items
                    </span>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden">
                    {broadcast.order.items.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-12 rounded-lg bg-white border-2 border-white overflow-hidden shadow-sm"
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
                    {broadcast.order.items.length > 5 && (
                      <div className="relative w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-indigo-500 border-2 border-white flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-white">
                          +{broadcast.order.items.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => acceptDelivery(broadcast._id)}
                    disabled={accepting === broadcast._id}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-sm hover:shadow-emerald-500/50 transition-all flex items-center cursor-pointer justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {accepting === broadcast._id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Package className="w-5 h-5" />
                        </motion.div>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Accept Delivery
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => rejectDelivery(broadcast._id)}
                    disabled={rejecting === broadcast._id}
                    className="w-18 bg-white border-2 border-gray-300 text-gray-700 rounded-xl cursor-pointer font-bold hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {rejecting === broadcast._id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <XCircle className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default BroadcastsSection;
