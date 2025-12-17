"use client";

import { CreditCard, Package, Wallet } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  paymentMethod: "cod" | "stripe";
  setPaymentMethod: (value: "cod" | "stripe") => void;
};

function PaymentSelector({ paymentMethod, setPaymentMethod }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
          <Wallet className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "cod"
              ? "border-rose-500 bg-rose-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value as "cod")}
            className="w-5 h-5 text-rose-600"
          />
          <Package className="w-5 h-5 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Cash on Delivery
            </p>
            <p className="text-xs text-gray-500">
              Pay when you receive your order
            </p>
          </div>
        </label>

        <label
          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "stripe"
              ? "border-rose-500 bg-rose-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={(e) => setPaymentMethod(e.target.value as "stripe")}
            className="w-5 h-5 text-rose-600"
          />
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Card Payment</p>
            <p className="text-xs text-gray-500">Pay securely with Stripe</p>
          </div>
          <div className="flex gap-1">
            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-semibold">
              VISA
            </div>
            <div className="w-8 h-5 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-semibold">
              MC
            </div>
          </div>
        </label>
      </div>
    </motion.div>
  );
}

export default PaymentSelector;
