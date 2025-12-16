"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import CheckoutButton from "./CheckoutButton";
import useCart from "@/hooks/useCart";

function CheckoutSection() {
  const router = useRouter();
  const { totalItems, cartTotal, deliveryFee, discount, grossTotal } =
    useCart();

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-semibold text-gray-800">Rs. {cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold text-gray-800">
            {deliveryFee === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `Rs. ${deliveryFee}`
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-green-600">
              -Rs. {discount}
            </span>
          </div>
        )}
        {cartTotal < 1000 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200"
          >
            <p className="text-xs font-medium text-blue-700">
              Add Rs. {1000 - cartTotal} more for FREE delivery!
            </p>
          </motion.div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-rose-600">
            Rs. {grossTotal}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <CheckoutButton onClick={() => router.push("/user/checkout")} />

      <p className="text-center text-xs text-gray-500 mt-3">
        Secure checkout with end-to-end encryption
      </p>
    </>
  );
}

export default CheckoutSection;
