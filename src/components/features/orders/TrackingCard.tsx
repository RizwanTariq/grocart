import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, Navigation, Phone, User, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { totalItems } from "@/app/user/orders/_components/utils";
import { IOrder, IOrderPopulated, IUser } from "@/types";
import { getSocket } from "@/libs/socket";
import { EmitterEvent } from "@/types/generic";

const LiveTrackingMap = dynamic(
  () => import("@/components/features/maps/LiveTrackingMap"),
  { ssr: false }
);

function TrackingCard({
  order,
  deliveryBoy,
  isDeliveryBoy = false,
  closeTrackingModal,
}: {
  isDeliveryBoy?: boolean;
  order: IOrderPopulated | IOrder;
  deliveryBoy: IUser | null;
  closeTrackingModal: () => void;
}) {
  const [riderLocation, setRiderLocation] = useState({
    lat: Number(deliveryBoy?.location.coordinates[1]),
    lng: Number(deliveryBoy?.location.coordinates[0]),
  });

  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    if (!deliveryBoy?._id) return;

    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    const event = `${EmitterEvent.D_B_LOCATION_UPDATED}_${deliveryBoy._id}`;

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
  }, [deliveryBoy?._id]);

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
                <h3 className="text-xl font-bold">
                  {isDeliveryBoy ? "Navigation" : "Live Delivery Tracking"}
                </h3>
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
            <span>
              {isDeliveryBoy ? "En route to customer" : "Delivery in progress"}
            </span>
            <span className="text-sm text-gray-200">
              • ETA {`${eta.toFixed(0)} - ${(eta + 2).toFixed(0)}`} mins
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 mx-5">
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
                <div className="">
                  {distance < 0.05 ? (
                    <p className="text-sm font-semibold text-emerald-600 mt-8">
                      Arrived at your place
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-bold text-blue-600">
                        {distance.toFixed(1)} km
                      </p>
                    </>
                  )}
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
                  onProgressAction={(distanceKm, etaMinutes) => {
                    setDistance(distanceKm);
                    setEta(etaMinutes);
                  }}
                />
              </div>
            </div>

            {isDeliveryBoy ? (
              /* Customer Info */
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${order.address.phone}`}
                  className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Customer
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.coordinates.lat},${order.address.coordinates.lng}&travelmode=driving&dir_action=navigate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Open in Maps
                </a>
              </div>
            ) : (
              /* Delivery Boy Info */
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
                    {deliveryBoy?.image ? (
                      <Image
                        src={deliveryBoy.image}
                        alt={deliveryBoy.name}
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
                      {deliveryBoy?.name || "Delivery Partner"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {distance < 0.05
                        ? "Arrived at delivery location"
                        : "On the way to delivery location"}
                    </p>
                  </div>
                  <a
                    href={`tel:${deliveryBoy?.contact}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-5 h-5 text-green-600" />
                  </a>
                </div>
              </div>
            )}

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
            {/* Mark as Delivered Button */}
            {isDeliveryBoy && (
              <button className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                <CheckCircle2 className="w-5 h-5" />
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default TrackingCard;
