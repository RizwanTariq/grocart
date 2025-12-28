"use client";

import { useEffect, useRef, useState } from "react";

import { ShoppingBag } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { IOrder } from "@/types";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/NonNavHeader";
import NoOrdersCard from "./NoOrdersCard";

import OrderCard from "./OrderCard";
import TrackingCard from "@/components/features/orders/TrackingCard";
// import axios from "axios";
import { getSocket } from "@/libs/socket";
import { EmitterEvent } from "@/types/generic";
import toast from "react-hot-toast";

const OrdersWrapper = ({ initialOrders }: { initialOrders: IOrder[] }) => {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const searchParams = useSearchParams();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    searchParams.get("order_id") || null
  );
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<IOrder | null>(null);

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  useEffect(() => {
    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    const handler = (data: IOrder) => {
      toast.success(`Your order #${data.orderNumber} has been updated!`, {
        duration: 10000,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === data._id ? data : order))
      );
    };

    socket.on(EmitterEvent.ORDER_UPDATED, handler);

    return () => {
      socket.off(EmitterEvent.ORDER_UPDATED, handler);
    };
  }, []);

  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get("/api/user/orders");
  //     if (response.status === 200) {
  //       setOrders(response.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const openTrackingModal = (order: IOrder) => {
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
                  openTrackingModal={openTrackingModal}
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
              closeTrackingModal={closeTrackingModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersWrapper;
