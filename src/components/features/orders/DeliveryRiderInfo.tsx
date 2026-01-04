"use client";

import DeliveryChat from "@/components/common/Chat";

import { IUser } from "@/types";

import { motion } from "motion/react";
import {
  Bike,
  MapPin,
  Phone,
  User as UserIcon,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import { formatLastActive } from "@/components/utils";

interface DeliveryRiderInfoProps {
  rider: IUser;
  customer: IUser;
  orderId: string;
  orderNumber: string;
  onTrackDelivery?: () => void;
}

const DeliveryRiderInfo = ({
  orderId,
  orderNumber,
  rider,
  customer,
  onTrackDelivery,
}: DeliveryRiderInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 relative group w-full"
    >
      {/* Animated glow border */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-rose-400 via-pink-400 to-rose-400 rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-all duration-500"></div>

      <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-4 md:p-5 border border-rose-100">
        {/* Animated background orb */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-300/20 rounded-full blur-3xl"></div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <Bike className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                Delivery Rider
                {rider.isOnline && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-600">
                {rider.isOnline
                  ? "Active now"
                  : `Last active ${formatLastActive(rider.lastActiveAt)}`}
              </p>
            </div>
          </div>

          {/* Rider Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Rider Avatar & Name */}
            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all">
              <div className="relative w-12 h-12 rounded-full ring-2 ring-blue-200 shrink-0">
                {rider.image ? (
                  <Image
                    src={rider.image}
                    alt={rider.name}
                    fill
                    sizes="48px"
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center  rounded-full">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                {rider.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Rider Name</p>
                <p className="font-semibold text-gray-900 truncate">
                  {rider.name}
                </p>
              </div>
            </div>

            {/* Contact Number */}
            {rider.contact && (
              <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Contact</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {rider.contact}
                  </p>
                </div>
                <a
                  href={`tel:${rider.contact}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors shrink-0"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                </a>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-3">
            {/* Track Delivery Button */}
            {onTrackDelivery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackDelivery();
                }}
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-5 h-5" />
                Track Live Delivery
              </button>
            )}
            {orderId && customer?._id && rider._id && (
              <DeliveryChat
                currentUserId={customer?._id}
                orderId={orderId}
                otherUser={{
                  _id: rider._id,
                  name: rider.name,
                  image: rider.image,
                  isOnline: rider.isOnline,
                  lastActiveAt: rider.lastActiveAt,
                  role: rider.role,
                }}
                orderNumber={orderNumber}
              />
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mt-3 text-sm">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span className="text-gray-700 font-medium">
              En route to customer
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryRiderInfo;
