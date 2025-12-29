"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  TrendingUp,
  Bike,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Bell,
  User,
  Zap,
  X,
  CreditCard,
} from "lucide-react";
import { IDeliveryAssignmentPopulated } from "@/types/dto/delivery-assignment";

import { PAYMENT_METHOD } from "@/types/enums";
import PageHeader from "@/components/PageHeader";
import { formatDate, totalItems } from "@/app/user/orders/_components/utils";
import { getSocket } from "@/libs/socket";
import { EmitterEvent } from "@/types/generic";
import toast from "react-hot-toast";
import axios from "axios";

type Props = {
  initialData: {
    broadcasts: IDeliveryAssignmentPopulated[];
    active: IDeliveryAssignmentPopulated | null;
    completed: IDeliveryAssignmentPopulated[];
    cancelled: IDeliveryAssignmentPopulated[];
  };
};

const DeliveryRiderDashboard = ({ initialData }: Props) => {
  const [deliveryBroadcasts, setDeliveryBroadcasts] = useState<
    IDeliveryAssignmentPopulated[]
  >(initialData.broadcasts);
  const [activeDelivery, setActiveDelivery] =
    useState<IDeliveryAssignmentPopulated | null>(initialData.active);
  const [completedDeliveries, setCompletedDeliveries] = useState<
    IDeliveryAssignmentPopulated[]
  >(initialData.completed);

  const [loading, setLoading] = useState(true);
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [navigationModalOpen, setNavigationModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      const [broadcastsRes, activeRes, completedRes] = await Promise.all([
        fetch("/api/delivery/broadcasts"),
        fetch("/api/delivery/active"),
        fetch("/api/delivery/completed"),
      ]);

      const broadcastsData = await broadcastsRes.json();
      const activeData = await activeRes.json();
      const completedData = await completedRes.json();

      setDeliveryBroadcasts(broadcastsData);
      setActiveDelivery(activeData);
      setCompletedDeliveries(completedData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  useEffect(() => {
    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    const handler = (data: IDeliveryAssignmentPopulated) => {
      toast.success(
        `New delivery request available for you! Order #${data.order.orderNumber}`,
        {
          duration: 10000,
        }
      );
      setDeliveryBroadcasts((prev) => [data, ...prev]);
    };

    socket.on(EmitterEvent.ORDER_BROADCASTED, handler);

    const handlerAcceptOrReject = (data: IDeliveryAssignmentPopulated) => {
      setDeliveryBroadcasts((prev) => prev.filter((b) => b._id !== data._id));
    };
    socket.on(EmitterEvent.DELIVERY_ACCEPTED, handlerAcceptOrReject);
    socket.on(EmitterEvent.DELIVERY_REJECTED, handlerAcceptOrReject);

    return () => {
      socket.off(EmitterEvent.ORDER_BROADCASTED, handler);
      socket.off(EmitterEvent.DELIVERY_ACCEPTED, handlerAcceptOrReject);
      socket.off(EmitterEvent.DELIVERY_REJECTED, handlerAcceptOrReject);
    };
  }, []);

  const acceptDelivery = async (assignmentId: string) => {
    try {
      setAccepting(assignmentId);
      const response = await axios.post(
        `/api/delivery-rider/assignments/${assignmentId}/accept`
      );

      if (response.status === 200) {
        setDeliveryBroadcasts((prev) =>
          prev.filter((b) => b._id !== assignmentId)
        );
        setActiveDelivery(response.data);
        toast.success(
          `Delivery accepted for order #${response.data.order.orderNumber}!`
        );
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
        setDeliveryBroadcasts((prev) =>
          prev.filter((b) => b._id !== assignmentId)
        );
      }
    } catch (error) {
      console.error("Error rejecting delivery:", error);
    } finally {
      setRejecting(null);
    }
  };

  const stats = {
    totalDeliveries: completedDeliveries.length,
    activeDelivery: activeDelivery ? 1 : 0,
    earnings: completedDeliveries.reduce(
      (sum, d) => sum + (d.order?.totalAmount || 0) * 0.1,
      0
    ),
    pendingBroadcasts: deliveryBroadcasts.length,
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <PageHeader
          icon={Bike}
          title="Rider Dashboard"
          subTitle="Manage your deliveries and track earnings"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              icon: Package,
              label: "Total Deliveries",
              value: stats.totalDeliveries,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              icon: Zap,
              label: "Active Delivery",
              value: stats.activeDelivery,
              color: "from-orange-500 to-orange-600",
              bgColor: "bg-orange-50",
              iconColor: "text-orange-600",
            },
            {
              icon: DollarSign,
              label: "Total Earnings",
              value: `Rs. ${Math.round(stats.earnings).toLocaleString()}`,
              color: "from-emerald-500 to-emerald-600",
              bgColor: "bg-emerald-50",
              iconColor: "text-emerald-600",
              isRevenue: true,
            },
            {
              icon: Bell,
              label: "New Broadcasts",
              value: stats.pendingBroadcasts,
              color: "from-rose-500 to-pink-600",
              bgColor: "bg-rose-50",
              iconColor: "text-rose-600",
              pulse: stats.pendingBroadcasts > 0,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform relative`}
                >
                  {stat.pulse && (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                    </div>
                  )}
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">
                {stat.label}
              </p>
              <p
                className={`font-bold text-gray-900 ${
                  stat.isRevenue ? "text-2xl" : "text-3xl"
                }`}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Broadcast Notifications */}
        {deliveryBroadcasts.length > 0 && (
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
                  {deliveryBroadcasts.length === 1 ? "order" : "orders"} waiting
                  for acceptance
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
                                broadcast.order.paymentMethod ===
                                PAYMENT_METHOD.CARD
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
                                Rs.{" "}
                                {Math.round(broadcast.order.totalAmount * 0.1)}
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
                            <h4 className="font-bold text-gray-900">
                              Order Items
                            </h4>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {totalItems(broadcast.order.items)} items
                          </span>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          {broadcast.order.items
                            .slice(0, 5)
                            .map((item, idx) => (
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
        )}

        {/* Active Delivery */}
        {activeDelivery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg relative">
                <Zap className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-400"></span>
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Active Delivery
                </h2>
                <p className="text-sm text-gray-600">Currently in progress</p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative group"
            >
              {/* Animated glow */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 rounded-2xl opacity-50 group-hover:opacity-100 blur transition-all duration-500"></div>

              <div className="relative bg-white rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 p-6 md:p-8 text-white relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                          >
                            <Bike className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-xs font-medium text-orange-100 mb-1">
                              Order Number
                            </p>
                            <h3 className="text-2xl md:text-3xl font-bold">
                              #{activeDelivery.order.orderNumber}
                            </h3>
                          </div>
                        </div>
                        <p className="text-lg text-orange-50 font-medium">
                          {activeDelivery.order.address.fullName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-orange-100 mb-2">
                          Your Earning
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                          <p className="text-3xl md:text-4xl font-bold">
                            Rs.{" "}
                            {Math.round(activeDelivery.order.totalAmount * 0.1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-orange-50">
                        Delivery In Progress
                      </span>
                      <span className="text-sm text-orange-200">
                        • ETA 15-20 mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 bg-linear-to-br from-orange-50/50 to-amber-50/30">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Delivery Address */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          Delivery Address
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Customer Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {activeDelivery.order.address.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              Phone Number
                            </p>
                            <p className="font-semibold text-gray-900">
                              {activeDelivery.order.address.phone}
                            </p>
                          </div>
                          <a
                            href={`tel:${activeDelivery.order.address.phone}`}
                            className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Phone className="w-5 h-5 text-green-600" />
                          </a>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Address
                            </p>
                            <p className="font-medium text-gray-900 text-sm leading-relaxed">
                              {activeDelivery.order.address.fullAddress}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {activeDelivery.order.address.city},{" "}
                              {activeDelivery.order.address.postalCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">
                            Order Items
                          </h4>
                          <p className="text-sm text-gray-600">
                            {totalItems(activeDelivery.order.items)} items total
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {activeDelivery.order.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 ring-2 ring-gray-200">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} {item.unit}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-gray-900">
                                Rs.{" "}
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">
                            Order Total
                          </span>
                          <span className="font-bold text-xl text-gray-900">
                            Rs.{" "}
                            {activeDelivery.order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setNavigationModalOpen(true)}
                      className="bg-linear-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Navigate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        await fetch(
                          `/api/delivery/assignments/${activeDelivery._id}/deliver`,
                          {
                            method: "POST",
                          }
                        );
                        fetchDashboardData();
                      }}
                      className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Delivered
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Completed Deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Delivery History
              </h2>
              <p className="text-sm text-gray-600">
                {completedDeliveries.length} completed deliveries • Rs.{" "}
                {Math.round(stats.earnings)} earned
              </p>
            </div>
          </div>

          {completedDeliveries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 md:p-16 text-center"
            >
              <div className="inline-flex p-6 bg-linear-to-br from-emerald-50 to-green-50 rounded-full mb-6">
                <Package className="w-16 h-16 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No deliveries yet
              </h3>
              <p className="text-gray-600 mb-6">
                Accept a delivery request to start earning!
              </p>
              <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold">
                <Zap className="w-5 h-5" />
                Check for new broadcasts above
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {completedDeliveries.map((delivery, idx) => {
                const isExpanded = expandedDelivery === delivery._id;
                return (
                  <motion.div
                    key={delivery._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="p-5 md:p-6 cursor-pointer"
                      onClick={() =>
                        setExpandedDelivery(isExpanded ? null : delivery._id)
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  #{delivery.order.orderNumber}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {delivery.order.address.fullName}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Delivered
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(
                                (delivery.deliveredAt as Date) ||
                                  delivery.createdAt
                              )}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-gray-400" />
                              {totalItems(delivery.order.items)} items
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {delivery.order.address.city}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="text-left md:text-right">
                            <p className="text-xs text-gray-500 mb-1">
                              Your Earning
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                              </div>
                              <p className="text-2xl font-bold text-emerald-600">
                                Rs.{" "}
                                {Math.round(delivery.order.totalAmount * 0.1)}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
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
                          <div className="p-5 md:p-6 bg-linear-to-br from-emerald-50/30 to-green-50/20">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Customer Details */}
                              <div>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <h4 className="font-bold text-gray-900">
                                    Customer Details
                                  </h4>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
                                  <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Name
                                      </p>
                                      <p className="font-semibold text-gray-900">
                                        {delivery.order.address.fullName}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Phone
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {delivery.order.address.phone}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Address
                                      </p>
                                      <p className="font-medium text-gray-900 text-sm leading-relaxed">
                                        {delivery.order.address.fullAddress}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {delivery.order.address.city},{" "}
                                        {delivery.order.address.postalCode}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  <h4 className="font-bold text-gray-900">
                                    Order Summary
                                  </h4>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      Total Items
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {totalItems(delivery.order.items)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      Payment Method
                                    </span>
                                    <span
                                      className={`font-semibold px-2 py-1 rounded text-xs ${
                                        delivery.order.paymentMethod ===
                                        PAYMENT_METHOD.CARD
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {delivery.order.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      Order Amount
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      Rs.{" "}
                                      {delivery.order.totalAmount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      Delivered At
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(
                                        (delivery.deliveredAt as Date) ||
                                          delivery.createdAt
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <div className="pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-gray-900">
                                        Your Earning
                                      </span>
                                      <span className="font-bold text-xl text-emerald-600">
                                        Rs.{" "}
                                        {Math.round(
                                          delivery.order.totalAmount * 0.1
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Package className="w-5 h-5 text-gray-600" />
                                <h4 className="font-bold text-gray-900">
                                  Items Delivered
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {delivery.order.items.map((item, itemIdx) => (
                                  <motion.div
                                    key={itemIdx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: itemIdx * 0.05 }}
                                    className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all group"
                                  >
                                    <div className="relative w-full aspect-square rounded-lg bg-gray-50 overflow-hidden mb-2 ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="150px"
                                        className="object-cover"
                                      />
                                      <div className="absolute top-1 right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                        {item.quantity}
                                      </div>
                                    </div>
                                    <p className="font-medium text-gray-900 text-xs truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.unit}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
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
        </motion.div>

        {/* Navigation Modal */}
        <AnimatePresence>
          {navigationModalOpen && activeDelivery && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setNavigationModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Navigation</h3>
                        <p className="text-sm text-orange-100">
                          Order #{activeDelivery.order.orderNumber}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNavigationModalOpen(false)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>En route to customer</span>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Delivery Info Card */}
                    <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Deliver to
                          </p>
                          <p className="font-semibold text-gray-900 text-lg">
                            {activeDelivery.order.address.fullName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activeDelivery.order.address.fullAddress}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Distance</p>
                          <p className="font-bold text-orange-600">2.5 km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{activeDelivery.order.address.phone}</span>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div
                      className="bg-gray-100 rounded-xl overflow-hidden"
                      style={{ height: "400px" }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="font-semibold">
                            Your Map Component Goes Here
                          </p>
                          <p className="text-sm mt-1">
                            Integrate your map to show route navigation
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${activeDelivery.order.address.phone}`}
                        className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        Call Customer
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${activeDelivery.order.address.coordinates.lat},${activeDelivery.order.address.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-5 h-5" />
                        Open in Maps
                      </a>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Items to Deliver (
                        {totalItems(activeDelivery.order.items)})
                      </h4>
                      <div className="space-y-2">
                        {activeDelivery.order.items.map((item, idx) => (
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
                                Qty: {item.quantity} {item.unit}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              Rs.{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">
                            Order Total
                          </span>
                          <span className="font-bold text-lg text-gray-900">
                            Rs.{" "}
                            {activeDelivery.order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Your Earning (10%)
                          </span>
                          <span className="font-bold text-emerald-600">
                            Rs.{" "}
                            {Math.round(activeDelivery.order.totalAmount * 0.1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mark as Delivered Button */}
                    <button
                      onClick={async () => {
                        // Call API to mark as delivered
                        await fetch(
                          `/api/delivery/assignments/${activeDelivery._id}/deliver`,
                          {
                            method: "POST",
                          }
                        );
                        setNavigationModalOpen(false);
                        fetchDashboardData();
                      }}
                      className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Delivered
                    </button>
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

export default DeliveryRiderDashboard;
