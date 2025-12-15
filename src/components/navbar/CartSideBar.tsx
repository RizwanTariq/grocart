import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import useCart from "@/hooks/useCart";

function CartSideBar({
  setCartMenu,
}: {
  setCartMenu: (value: boolean) => void;
}) {
  const {
    cartCount,
    cartItems,
    cartTotal,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
  } = useCart();
  const deliveryFee = 50;
  const total = cartTotal + deliveryFee;
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9999"
        onClick={() => setCartMenu(false)}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{
          duration: 2,
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-white z-9999 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-rose-600 to-rose-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <p className="text-white/80 text-sm">{cartCount} items</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center cursor-pointer  transition-colors"
            onClick={() => setCartMenu(false)}
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingCart
                  className="w-12 h-12 text-gray-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-rose-600 font-bold text-base mb-3">
                        Rs. {item.price}
                        <span className="text-xs text-gray-400 font-normal ml-1">
                          / {item.unit}
                        </span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                            onClick={() => decreaseQuantity(item.productId)}
                          >
                            <Minus
                              className="w-3.5 h-3.5 text-gray-600"
                              strokeWidth={2.5}
                            />
                          </motion.button>

                          <span className="w-8 text-center text-sm font-semibold text-gray-800">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={item.quantity >= item.countInStock}
                            className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                            onClick={() => increaseQuantity(item.productId)}
                          >
                            <Plus
                              className="w-3.5 h-3.5 text-gray-600"
                              strokeWidth={2.5}
                            />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2
                            className="w-4 h-4 text-red-600"
                            strokeWidth={2}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
            {/* Price Summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  Rs. {cartTotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-gray-800">
                  Rs. {deliveryFee}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-base font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-rose-600">
                  Rs. {total}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>

            <p className="text-center text-xs text-gray-500 mt-3">
              Secure checkout with end-to-end encryption
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default CartSideBar;
