import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { IOrderItemDB } from "@/types/models/order.model";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

export const totalItems = (items: IOrderItemDB[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const getStatusConfig = (status: ORDER_STATUS) => {
  const configs = {
    [ORDER_STATUS.PENDING]: {
      icon: Clock,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Pending",
      dotColor: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200 ring-1 ring-amber-100",
    },
    [ORDER_STATUS.CONFIRMED]: {
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Confirmed",
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200 ring-1 ring-blue-100",
    },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: {
      icon: Truck,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Out for Delivery",
      dotColor: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200 ring-1 ring-purple-100",
    },
    [ORDER_STATUS.DELIVERED]: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 border-green-200",
      label: "Delivered",
      dotColor: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200 ring-1 ring-green-100",
    },
    [ORDER_STATUS.CANCELLED]: {
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Cancelled",
      dotColor: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200 ring-1 ring-red-100",
    },
    [ORDER_STATUS.EXPIRED]: {
      icon: XCircle,
      color: "bg-gray-100 text-gray-700 border-gray-200",
      label: "Expired",
      dotColor: "bg-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200 ring-1 ring-gray-100",
    },
  };
  return configs[status] || configs[ORDER_STATUS.PENDING];
};

export const getPaymentStatusConfig = (status: PAYMENT_STATUS) => {
  const configs = {
    [PAYMENT_STATUS.PAYMENT_PENDING]: {
      icon: AlertCircle,
      color: "bg-orange-50 text-orange-700 border-orange-200",
      label: "Payment Pending",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200 ring-1 ring-orange-100",
    },
    [PAYMENT_STATUS.PAYMENT_PAID]: {
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Payment Paid",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200 ring-1 ring-emerald-100",
    },
    [PAYMENT_STATUS.PAYMENT_FAILED]: {
      icon: XCircle,
      color: "bg-red-50 text-red-700 border-red-200",
      label: "Payment Failed",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200 ring-1 ring-red-100",
    },
  };
  return configs[status];
};

export const getOrderStatusLabelWithAll = (status: ORDER_STATUS | "ALL") => {
  const labels = {
    ALL: "All Order Statuses",
    [ORDER_STATUS.PENDING]: "Pending",
    [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out for Delivery",
    [ORDER_STATUS.DELIVERED]: "Delivered",
    [ORDER_STATUS.CANCELLED]: "Cancelled",
    [ORDER_STATUS.EXPIRED]: "Expired",
    [ORDER_STATUS.CONFIRMED]: "Confirmed",
  };
  return labels[status] || status;
};

export const getPaymentMethodLabel = (method: PAYMENT_METHOD) => {
  const labels = {
    [PAYMENT_METHOD.CARD]: "Card Payment",
    [PAYMENT_METHOD.COD]: "Cash on Delivery",
  };
  return labels[method] || method;
};

export const getPaymentStatusLabel = (status: PAYMENT_STATUS) => {
  const labels = {
    [PAYMENT_STATUS.PAYMENT_PENDING]: "Pending",
    [PAYMENT_STATUS.PAYMENT_PAID]: "Paid",
    [PAYMENT_STATUS.PAYMENT_FAILED]: "Failed",
  };
  return labels[status] || status;
};

export const getPaymentStatusLabelWithAll = (
  status: PAYMENT_STATUS | "ALL"
) => {
  const labels = {
    ALL: "All Payment Statuses",
    [PAYMENT_STATUS.PAYMENT_PENDING]: "Pending",
    [PAYMENT_STATUS.PAYMENT_PAID]: "Paid",
    [PAYMENT_STATUS.PAYMENT_FAILED]: "Failed",
  };
  return labels[status] || status;
};
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

export { formatLastActive };
