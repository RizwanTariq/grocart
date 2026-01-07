"use client";

import { totalItems } from "@/components/utils";
import { IDeliveryAssignmentPopulated } from "@/types/dto/delivery-assignment";
import {
  Bike,
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import DeliveryChat from "../../../../components/common/Chat";

import { useUser } from "@/hooks/useUser";

import { IUser } from "@/types";
import toast from "react-hot-toast";
import { useState } from "react";
import OTPVerificationModal from "./OtpVerificationModal";
import axios from "axios";

interface ActiveDeliveryProps {
  delivery: IDeliveryAssignmentPopulated;
  openNavigationModal: () => void;
}

function ActiveDelivery({
  delivery,
  openNavigationModal,
}: ActiveDeliveryProps) {
  const { user } = useUser();
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const customer = delivery.order.user as unknown as IUser;

  const [otpRequested, setOtpRequested] = useState(false);

  const handleRequestOTP = async () => {
    setIsRequestingOTP(true);
    try {
      const response = await axios.post(
        `/api/delivery-rider/assignments/${delivery._id}/otp/request`
      );
      setOtpRequested(true);
      setIsRequestingOTP(false);
      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        return true;
      }
      return false;
    } catch (error) {
      setIsRequestingOTP(false);
      console.error("Error requesting OTP:", error);
      return false;
    }
  };
  const handleVerifyOTP = async (otp: string) => {
    setIsVerifyingOTP(true);
    try {
      const response = await axios.post(
        `/api/delivery-rider/assignments/${delivery._id}/otp/verify`,
        {
          otp,
        }
      );
      setIsVerifyingOTP(false);
      if (response.status === 200) {
        toast.success("Delivery verified successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsVerifyingOTP(false);
      return false;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg relative">
            <Zap className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-600 opacity-85"></span>
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
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-linear-to-r from-rose-600 via-rose-500 to-pink-600 p-6 md:p-8 text-white relative overflow-hidden">
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
                        <p className="text-xs font-medium text-rose-100 mb-1">
                          Order Number
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold">
                          #{delivery.order.orderNumber}
                        </h3>
                      </div>
                    </div>
                    <p className="text-lg text-rose-50 font-medium">
                      {delivery.order.address.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-rose-100 mb-2">
                      Your Earning
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                      <p className="text-3xl md:text-4xl font-bold">
                        Rs. {Math.round(delivery.order.totalAmount * 0.1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-rose-50">
                    Delivery In Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
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
                          {delivery.order.address.fullName}
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
                          {delivery.order.address.phone}
                        </p>
                      </div>
                      <a
                        href={`tel:${delivery.order.address.phone}`}
                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                      </a>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
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
                        {totalItems(delivery.order.items)} items total
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {delivery.order.items.map((item, idx) => (
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
                            Rs. {(item.price * item.quantity).toLocaleString()}
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
                        Rs. {delivery.order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Now includes Chat */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openNavigationModal}
                  className="bg-linear-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-5 h-5" />
                  Navigate
                </motion.button>

                {/* Chat Button */}
                {delivery.order?._id && user?._id && (
                  <DeliveryChat
                    orderId={delivery.order._id}
                    currentUserId={user._id}
                    otherUser={{
                      _id: customer._id,
                      name: delivery.order.address.fullName,
                      image: customer.image,
                      isOnline: customer.isOnline,
                      lastActiveAt: customer.lastActiveAt,
                      role: customer.role,
                    }}
                    orderNumber={delivery.order.orderNumber}
                  />
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestOTP}
                  disabled={isRequestingOTP || isVerifyingOTP}
                  className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isRequestingOTP ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Mark Delivered
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <OTPVerificationModal
        isOpen={otpRequested}
        onClose={() => setOtpRequested(false)}
        onVerify={handleVerifyOTP}
        onResendOTP={handleRequestOTP}
        customerName={delivery.order.address.fullName}
        customerPhone={delivery.order.address.phone}
        orderNumber={delivery.order.orderNumber}
      />
    </>
  );
}

export default ActiveDelivery;
