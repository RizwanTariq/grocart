import { IOrder } from "@/types";
import { Package } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { MapPin, Phone, Mail, FileText, Navigation, Truck } from "lucide-react";
import { ORDER_STATUS, PAYMENT_METHOD } from "@/types/enums";
import {
  getPaymentStatusConfig,
  totalItems,
} from "@/app/user/orders/_components/utils";

function ExpandedCard({
  order,
  openTrackingModal,
}: {
  order: IOrder;
  openTrackingModal: (order: IOrder) => void;
}) {
  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-gray-100"
    >
      <div className="p-4 md:p-6 bg-linear-to-br from-gray-50 to-rose-50/20">
        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-rose-600" />
              </div>
              <h4 className="font-bold text-gray-900">
                Order Items ({order.items.length})
              </h4>
            </div>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 ring-2 ring-gray-100">
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
                      {item.quantity} {item.unit.toLowerCase()} × Rs.{" "}
                      {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg md:text-xl font-bold text-gray-900">
                      Rs. {(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Customer & Address Info */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Delivery Address</h4>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm space-y-3 text-sm">
                <p className="font-semibold text-gray-900 text-base">
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
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-gray-900">Order Summary</h4>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded-lg text-xs ${
                      order.paymentMethod === PAYMENT_METHOD.COD
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded-lg text-xs ${paymentConfig.color}`}
                  >
                    {paymentConfig.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-semibold text-gray-900">
                    {totalItems(order.items)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.createdAt as Date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-xl md:text-2xl bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Tracking Section */}
          {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
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
                    Order is out for delivery!
                  </p>
                  <p className="text-xs text-blue-700">
                    Track the delivery in real-time
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ExpandedCard;
