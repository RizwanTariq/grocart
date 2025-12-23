"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, ShoppingBag, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IOrder } from "@/types";
import { useSearchParams } from "next/navigation";
import Header from "../../_components/Header";
import NoOrdersCard from "./NoOrdersCard";
import { totalItems } from "./utils";
import OrderCard from "./OrderCard";

const OrdersWrapper = ({ orders }: { orders: IOrder[] }) => {
  const searchParams = useSearchParams();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    searchParams.get("order_id") || null
  );
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<IOrder | null>(null);

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
    <div className="min-h-screen">
      {/* Header */}
      <Header
        Icon={ShoppingBag}
        title="My Orders"
        subtitle="Track and manage your orders"
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {orders.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <NoOrdersCard />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              return (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  expandedOrder={expandedOrder}
                  toggleOrder={toggleOrder}
                  openTrackingModal={openTrackingModal}
                />
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

export default OrdersWrapper;
