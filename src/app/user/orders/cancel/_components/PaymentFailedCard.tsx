"use client";

import { XCircle, AlertCircle, ArrowRight, LucideLoader } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import useCart from "@/hooks/useCart";

function PaymentFailedCard({
  orderId,
  sessionId,
}: {
  orderId: string;
  sessionId: string;
}) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (!orderId || !sessionId) return;

    async function cancelOrder() {
      try {
        const res = await axios.post(`/api/user/orders/${orderId}/cancel`);
        if (res.status !== 200) {
          router.replace(`/user/orders?order_id=${orderId}`);
        }
        setOrderNumber(res.data.orderNo);
        clearCart();
      } catch (error) {
        console.error(error);
        router.replace(`/user/orders?order_id=${orderId}`);
      }
    }

    cancelOrder();
  }, [orderId, sessionId, router, clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md sm:max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.3,
          }}
          className="w-16 h-16 sm:w-24 sm:h-24 relative rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6"
        >
          <XCircle className="w-16 h-16 sm:w-24 sm:h-24 text-red-600" />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0.6, 1, 0.6] }}
            transition={{
              delay: 0.6,
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-red-950 blur-2xl rounded-full" />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-3 sm:mb-6 text-sm sm:text-base">
          Unfortunately, we couldn&apos;t process your payment. Don&apos;t
          worry, your order is saved.
          <span className="hidden sm:inline">
            {" "}
            You can retry the payment or choose a different payment method from
            your orders page.
          </span>
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-semibold text-red-900 mb-1">
                Payment could not be completed
              </p>
              <p className="text-xs text-red-700">
                This could be due to insufficient funds, card expiry, or network
                issues. Please try again from your orders page.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 flex justify-center items-center">
            {orderNumber ? (
              `#${orderNumber}`
            ) : (
              <LucideLoader className="w-5 h-5 animate-spin" />
            )}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.replace(`/user/orders?order_id=${orderId}`)}
            className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to My Orders
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.replace("/user/products")}
            className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default PaymentFailedCard;
