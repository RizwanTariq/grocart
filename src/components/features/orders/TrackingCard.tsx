import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Navigation, Phone, User, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { totalItems } from "@/app/user/orders/_components/utils";
import { IOrderPopulated } from "@/types";
import { getSocket } from "@/libs/socket";
import { EmitterEvent } from "@/types/generic";

const LiveTrackingMap = dynamic(
  () => import("@/components/features/maps/LiveTrackingMap"),
  { ssr: false }
);

function TrackingCard({
  order,
  closeTrackingModal,
}: {
  order: IOrderPopulated;
  closeTrackingModal: () => void;
}) {
  const [riderLocation, setRiderLocation] = useState({
    lat: Number(order.assignedDeliveryBoy?.location.coordinates[1]),
    lng: Number(order.assignedDeliveryBoy?.location.coordinates[0]),
  });

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    if (!order.assignedDeliveryBoy?._id) return;

    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    const event = `${EmitterEvent.D_B_LOCATION_UPDATED}_${order.assignedDeliveryBoy?._id}`;

    const handler = (data: {
      userId: string;
      latitude: number;
      longitude: number;
      isDeliveryBoy: boolean;
    }) => {
      setRiderLocation({
        lng: Number(data.longitude),
        lat: Number(data.latitude),
      });
    };

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [order.assignedDeliveryBoy?._id]);

  return (
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
                <h3 className="text-xl font-bold">Live Delivery Tracking</h3>
                <p className="text-sm text-blue-100">#{order.orderNumber}</p>
              </div>
            </div>
            <button
              onClick={closeTrackingModal}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
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
                  <p className="text-sm text-gray-600 mb-1">Delivery to</p>
                  <p className="font-semibold text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.address.fullAddress}
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
                <span>{order.address.phone}</span>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <LiveTrackingMap
                  staticPosition={{
                    lat: Number(order.address.coordinates.lat),
                    lng: Number(order.address.coordinates.lng),
                  }}
                  movingPosition={riderLocation}
                  status="online"
                />
              </div>
            </div>

            {/* Delivery Boy Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
                  {order.assignedDeliveryBoy?.image ? (
                    <Image
                      src={order.assignedDeliveryBoy?.image}
                      alt={order.assignedDeliveryBoy?.name}
                      fill
                      sizes="(max-width: 768px) 30vw, 50vw"
                      loading="eager"
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-7 w-7 text-white-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {order.assignedDeliveryBoy?.name || "Delivery Partner"}
                  </p>
                  <p className="text-sm text-gray-600">
                    On the way to delivery location
                  </p>
                </div>
                <a
                  href={`tel:${order.assignedDeliveryBoy?.contact}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                </a>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-3">
                Order Items ({totalItems(order.items)})
              </h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
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
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="font-bold text-lg text-rose-600">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default TrackingCard;
