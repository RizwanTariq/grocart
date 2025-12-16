"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Package,
  Truck,
  Shield,
} from "lucide-react";

import useCart from "@/hooks/useCart";
import QuantitySelector from "@/components/QuantitySelector";
import IconButton from "@/components/common/IconButton";
import CheckoutSection from "@/components/features/cart/CheckoutSection";
import { useRouter } from "next/navigation";

function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {cartItems.length} items in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center"
          >
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart
                className="w-16 h-16 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything to your cart yet
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              <span>Continue Shopping</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 30vw, 50vw"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-rose-600">
                              Rs. {item.price}
                            </span>
                            <span className="text-sm text-gray-400">
                              / {item.unit}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <IconButton
                          onClick={() => removeFromCart(item.productId)}
                          Icon={Trash2}
                          size="md"
                          variant="danger"
                        />
                      </div>

                      {/* Quantity and Subtotal */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 sm:gap-3">
                          <span className="text-sm font-medium text-gray-600">
                            Quantity:
                          </span>
                          <QuantitySelector
                            quantity={item.quantity}
                            onDecrease={() => decreaseQuantity(item.productId)}
                            onIncrease={() => increaseQuantity(item.productId)}
                            increaseDisabled={
                              item.quantity >= item.countInStock
                            }
                            decreaseDisabled={item.quantity <= 1}
                          />
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                          <p className="text-sm sm:text-xl font-bold text-gray-800">
                            Rs. {item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.countInStock && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"
                        >
                          <p className="text-xs font-medium text-amber-700">
                            Maximum available quantity reached
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Continue Shopping Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-rose-300 hover:bg-rose-50/50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-rose-600 font-medium"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                <span>Continue Shopping</span>
              </motion.button>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Order Summary
                  </h2>

                  <CheckoutSection />
                </motion.div>

                {/* Benefits Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-linear-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-6"
                >
                  <h3 className="text-sm font-bold text-gray-800 mb-4">
                    Why shop with us?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Package
                          className="w-4 h-4 text-rose-600"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Quality Products
                        </p>
                        <p className="text-xs text-gray-600">
                          Fresh & organic guaranteed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Truck
                          className="w-4 h-4 text-rose-600"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Fast Delivery
                        </p>
                        <p className="text-xs text-gray-600">
                          Same-day delivery available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Shield
                          className="w-4 h-4 text-rose-600"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Secure Payment
                        </p>
                        <p className="text-xs text-gray-600">
                          100% safe & encrypted
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
