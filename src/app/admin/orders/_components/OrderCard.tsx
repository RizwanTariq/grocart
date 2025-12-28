import {
  formatDate,
  getStatusConfig,
  totalItems,
} from "@/app/user/orders/_components/utils";
import { IOrder } from "@/types";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import {
  AlertCircle,
  Banknote,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Package,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import OrderStatusSelector from "./OrderStatusSelector";
import PaymentStatusSelector from "./PaymentStatusSelector";
import ExpandedCard from "./ExpandedCard";

function OrderCard({
  order,
  isExpanded,
  index,
  statusLoading,
  paymentLoading,
  updateOrderStatus,
  updatePaymentStatus,
  openTrackingModal,
  expandOrder,
}: {
  order: IOrder;
  isExpanded: boolean;
  statusLoading: boolean;
  paymentLoading: boolean;
  index: number;
  updateOrderStatus: (orderId: string, newStatus: ORDER_STATUS) => void;
  updatePaymentStatus: (orderId: string, newStatus: PAYMENT_STATUS) => void;
  openTrackingModal: (order: IOrder) => void;
  expandOrder: (orderId: string) => void;
}) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isExpanded ? "ring-2 ring-rose-200" : ""
      }`}
    >
      <div
        className="p-4 md:p-6 cursor-pointer"
        onClick={() => expandOrder(order._id)}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                #{order.orderNumber}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
                <span
                  className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}
                ></span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(order.createdAt as Date)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" />
                {order.address.fullName}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gray-400" />
                {order.address.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-gray-400" />
                {totalItems(order.items)} items
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <div className="text-left lg:text-right">
              <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Rs. {order.totalAmount.toLocaleString()}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mt-2 ${
                  order.paymentMethod === PAYMENT_METHOD.COD
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.paymentMethod === PAYMENT_METHOD.COD ? (
                  <Banknote className="w-3.5 h-3.5" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5" />
                )}
                {order.paymentMethod}
              </span>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer lg:ml-4">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Order Status
            </label>
            <OrderStatusSelector
              order={order}
              loading={statusLoading}
              updateOrderStatus={updateOrderStatus}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Payment Status
            </label>
            <PaymentStatusSelector
              order={order}
              loading={paymentLoading}
              updatePaymentStatus={updatePaymentStatus}
            />
            {order.paymentMethod !== PAYMENT_METHOD.COD && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                Auto-managed by payment gateway
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <ExpandedCard order={order} openTrackingModal={openTrackingModal} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OrderCard;
