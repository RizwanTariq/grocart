"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import useCart from "@/hooks/useCart";
import { useEffect, useState } from "react";
import axios from "axios";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";

function OrderPlacedCard({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState("");

  // Only clear cart if payment is successful or payment method is COD
  useEffect(() => {
    async function finalize() {
      const res = await axios.get(`/api/user/orders/${orderId}/verify`);

      if (
        res.data.paymentStatus === PAYMENT_STATUS.PAYMENT_PAID ||
        res.data.paymentMethod === PAYMENT_METHOD.COD
      ) {
        setOrderNumber(res.data.orderNumber);
        clearCart(); // ✅ ONLY HERE
      }
    }

    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md sm:max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.3,
          }}
          className="w-16 h-16 sm:w-24 sm:h-24 relative rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6"
        >
          <CheckCircle className="w-16 h-16 sm:w-24 sm:h-24 text-rose-600" />
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
            <div className="w-full h-full bg-rose-950 blur-2xl rounded-full" />
          </motion.div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Order Placed!
        </h2>
        <p className="text-gray-600 mb-3 sm:mb-6 text-sm sm:text-base">
          Thank you for shopping with us! Your order has been successfully
          placed.
          <span className="hidden sm:inline">
            We&apos;re processing it now. You can track your order in the{" "}
            <span
              className="font-semibold text-rose-600 cursor-pointer"
              onClick={() => router.push("/user/orders")}
            >
              Orders
            </span>{" "}
            section.
          </span>
        </p>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-600">
            #{orderNumber}
          </p>
        </div>
        <button
          onClick={() => router.push("/user/products")}
          className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-2 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
}

export default OrderPlacedCard;
