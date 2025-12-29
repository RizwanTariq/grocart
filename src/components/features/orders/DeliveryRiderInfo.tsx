import { IUser } from "@/types";
import { motion } from "framer-motion";
import {
  Bike,
  MapPin,
  Phone,
  User as UserIcon,
  Navigation,
} from "lucide-react";
import Image from "next/image";

interface DeliveryRiderInfoProps {
  rider: IUser;
  onTrackDelivery?: () => void;
}

const DeliveryRiderInfo = ({
  rider,
  onTrackDelivery,
}: DeliveryRiderInfoProps) => {
  const formatLastActive = (date?: Date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Active now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 relative group w-full"
    >
      {/* Animated glow border */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 rounded-2xl opacity-50 group-hover:opacity-80 blur-sm transition-all duration-500"></div>

      <div className="relative bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-5 border border-blue-100">
        {/* Animated background orb */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl"></div>

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
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200 shrink-0">
                {rider.image ? (
                  <Image
                    src={rider.image}
                    alt={rider.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
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
                  className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors shrink-0"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                </a>
              </div>
            )}
          </div>

          {/* Track Delivery Button */}
          {onTrackDelivery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrackDelivery();
              }}
              className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              <Navigation className="w-5 h-5" />
              Track Live Delivery
            </button>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mt-3 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
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
