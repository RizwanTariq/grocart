"use client";

import { useEffect, useState } from "react";

import { ShoppingBag } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { IOrderPopulated } from "@/types";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/NonNavHeader";
import NoOrdersCard from "./NoOrdersCard";

import OrderCard from "./OrderCard";
import TrackingCard from "@/components/features/orders/TrackingCard";
import { EmitterEvent } from "@/types/generic";
import toast from "react-hot-toast";
import axios from "axios";
import { IDeliveryAssignmentPopulated } from "@/types/dto/delivery-assignment";
import { useSocket } from "@/SocketContext";

const OrdersWrapper = ({
  initialOrders,
}: {
  initialOrders: IOrderPopulated[];
}) => {
  const [orders, setOrders] = useState<IOrderPopulated[]>(initialOrders);
  const searchParams = useSearchParams();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    searchParams.get("order_id") || null
  );
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<IOrderPopulated | null>(null);

  const fetchOrderAndSetState = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/user/orders/${orderId}`);
      if (response.status === 200) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? response.data : order))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { socket, connected } = useSocket();
  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handler = (data: IOrderPopulated) => {
      toast.success(`Your order #${data.orderNumber} has been updated!`, {
        duration: 10000,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === data._id ? data : order))
      );
    };

    socket.on(EmitterEvent.ORDER_UPDATED, handler);

    const handlerDelivery = (data: IDeliveryAssignmentPopulated) => {
      fetchOrderAndSetState(data.order._id);
    };

    socket.on(EmitterEvent.DELIVERY_ACCEPTED, handlerDelivery);

    socket.on(EmitterEvent.DELIVERY_COMPLETED, handlerDelivery);

    return () => {
      socket.off(EmitterEvent.ORDER_UPDATED, handler);
      socket.off(EmitterEvent.DELIVERY_ACCEPTED, handlerDelivery);
      socket.off(EmitterEvent.DELIVERY_COMPLETED, handlerDelivery);
    };
  }, [socket, connected]);

  const openTrackingModal = (order: IOrderPopulated) => {
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
                  openTrackingModal={() => openTrackingModal(order)}
                />
              );
            })}
          </div>
        )}

        {/* Live Tracking Modal */}
        <AnimatePresence>
          {trackingModalOpen && selectedOrderForTracking && (
            <TrackingCard
              order={selectedOrderForTracking}
              deliveryBoy={selectedOrderForTracking.assignedDeliveryBoy}
              closeTrackingModal={closeTrackingModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersWrapper;
