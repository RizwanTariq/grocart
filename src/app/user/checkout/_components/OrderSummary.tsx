"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import useCart from "@/hooks/useCart";

type Props = {
  handleSubmit: (e: React.FormEvent) => void;
  processing: boolean;
  paymentMethod: "cod" | "stripe";
};

function OrderSummary({ handleSubmit, processing, paymentMethod }: Props) {
  const {
    cartItems,
    cartTotal,
    deliveryFee,
    grossTotal,
    discount,
    totalItems,
  } = useCart();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
        </div>

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                Rs. {item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
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
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span className="text-rose-600">Rs. {grossTotal}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={processing}
          className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
            </>
          )}
        </button>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            Your order will be delivered within 2-3 business days
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderSummary;
