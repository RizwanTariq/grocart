import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { IOrderItemDB } from "@/types/models/order.model";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

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
    },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: {
      icon: Truck,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Out for Delivery",
      dotColor: "bg-blue-500",
    },
    [ORDER_STATUS.DELIVERED]: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 border-green-200",
      label: "Delivered",
      dotColor: "bg-green-500",
    },
    [ORDER_STATUS.CANCELLED]: {
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Cancelled",
      dotColor: "bg-red-500",
    },
    [ORDER_STATUS.EXPIRED]: {
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Expired",
      dotColor: "bg-red-500",
    },
    [ORDER_STATUS.CONFIRMED]: {
      icon: CheckCircle,
      color: "bg-sky-100 text-sky-700 border-sky-200",
      label: "Confirmed",
      dotColor: "bg-sky-500",
    },
  };
  return configs[status] || configs[ORDER_STATUS.PENDING];
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
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
