"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Package,
  MapPin,
  Phone,
  CheckCircle2,
  Bike,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Zap,
} from "lucide-react";
import { IDeliveryAssignmentPopulated } from "@/types/dto/delivery-assignment";

import { PAYMENT_METHOD } from "@/types/enums";
import PageHeader from "@/components/PageHeader";
import { formatDate, totalItems } from "@/components/utils";
import { EmitterEvent } from "@/types/generic";
import toast from "react-hot-toast";
import TrackingCard from "@/components/features/orders/TrackingCard";
import { useUser } from "@/hooks/useUser";
import StatsGrid from "./StatsGrid";
import BroadcastsSection from "./BroadcastsSection";
import ActiveDelivery from "./ActiveDelivery";
import { useSocket } from "@/SocketContext";

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

  const { user } = useUser();

  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  const [navigationModalOpen, setNavigationModalOpen] = useState(false);

  const { socket, connected } = useSocket();
  useEffect(() => {
    if (!socket || !connected) {
      console.warn("Socket not connected");
      return;
    }

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
  }, [socket, connected]);

  const stats = {
    totalDeliveries: completedDeliveries.length,
    activeDelivery: activeDelivery ? 1 : 0,
    earnings: completedDeliveries.reduce(
      (sum, d) => sum + (d.order?.totalAmount || 0) * 0.1,
      0
    ),
    pendingBroadcasts: deliveryBroadcasts.length,
  };

  const handleAcceptDelivery = (
    assignmentId: string,
    delivery: IDeliveryAssignmentPopulated
  ) => {
    setDeliveryBroadcasts((prev) => prev.filter((b) => b._id !== assignmentId));
    setActiveDelivery(delivery);
  };
  const handleRejectDelivery = (assignmentId: string) => {
    setDeliveryBroadcasts((prev) => prev.filter((b) => b._id !== assignmentId));
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
        <StatsGrid {...stats} />

        {/* Broadcast Notifications */}
        {deliveryBroadcasts.length > 0 && (
          <BroadcastsSection
            deliveryBroadcasts={deliveryBroadcasts}
            onAcceptAction={handleAcceptDelivery}
            onRejectAction={handleRejectDelivery}
          />
        )}

        {/* Active Delivery */}
        {activeDelivery && (
          <ActiveDelivery
            delivery={activeDelivery}
            openNavigationModal={() => setNavigationModalOpen(true)}
          />
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
                                      {formatDate(
                                        (delivery.deliveredAt as Date) ||
                                          delivery.createdAt
                                      )}
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
            <TrackingCard
              isDeliveryBoy={true}
              order={activeDelivery.order}
              deliveryBoy={user}
              closeTrackingModal={() => setNavigationModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryRiderDashboard;
