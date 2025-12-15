import { ShoppingCart, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import useCart from "@/hooks/useCart";
import QuantitySelector from "@/components/QuantitySelector";
import IconButton from "@/components/common/IconButton";
import CheckoutSection from "../cart/CheckoutSection";

function CartSideBar({
  setCartMenu,
}: {
  setCartMenu: (value: boolean) => void;
}) {
  const {
    cartCount,
    cartItems,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
  } = useCart();

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
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() => decreaseQuantity(item.productId)}
                          onIncrease={() => increaseQuantity(item.productId)}
                          increaseDisabled={item.quantity >= item.countInStock}
                          decreaseDisabled={item.quantity <= 1}
                        />

                        <IconButton
                          onClick={() => removeFromCart(item.productId)}
                          Icon={Trash2}
                          size="sm"
                          variant="danger"
                        />
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
            <CheckoutSection />
          </div>
        )}
      </motion.div>
    </>
  );
}

export default CartSideBar;
