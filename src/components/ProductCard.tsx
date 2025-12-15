"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ShoppingBag, Heart, Plus, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { useStore } from "@/store/useStore";
import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, UNIT_LABELS } from "@/constants/product";
import { IProduct } from "@/types/dto";

import QuantitySelector from "./QuantitySelector";

function ProductCard({ product }: { product: IProduct }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const [quantity, setQuantity] = useState(1);

  const quantityCart = useStore((s) =>
    s.cartItems.reduce((sum, i) => {
      return i.productId === product._id ? sum + i.quantity : sum;
    }, 0)
  );

  const remainingStock = mounted
    ? Math.max(product.countInStock - quantityCart, 0)
    : product.countInStock;

  const addToCart = useStore((s) => s.addToCart);

  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const isFavorite = useStore((s) => s.favorites.includes(product._id));

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= remainingStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const isLowStock = remainingStock < 30;
  const isInCart = quantityCart > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50",
        "border-gray-200/60 hover:border-gray-300/80"
      )}
    >
      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleFavorite(product._id)}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-white cursor-pointer"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isFavorite ? "fill-rose-500 stroke-rose-500" : "stroke-gray-400"
          }`}
          strokeWidth={2}
        />
      </motion.button>

      {/* Stock badge */}
      {remainingStock === 0 ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-300/60 backdrop-blur-sm shadow-sm"
        >
          <span className="text-xs font-semibold text-gray-600">
            Out of Stock
          </span>
        </motion.div>
      ) : isLowStock ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 backdrop-blur-sm shadow-sm"
        >
          <span className="text-xs font-semibold text-amber-700">
            Only {remainingStock} left
          </span>
        </motion.div>
      ) : null}

      {/* Image container */}
      <div
        className={cn(
          "relative w-full aspect-square bg-gray-50/50 overflow-hidden",
          remainingStock === 0 && "opacity-60"
        )}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width:768px) 100vw, 33vw"
        />

        {/* In Cart Overlay Badge */}
        <AnimatePresence>
          {isInCart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-0 right-0 bg-linear-to-r from-rose-600 via-rose-500 to-rose-600 px-5 py-2.5 shadow-inner shadow-rose-400/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-white text-sm font-semibold">
                    {quantityCart} in cart
                  </span>
                </div>
                <div className="text-white/90 text-xs font-medium">
                  Rs. {product.price * quantityCart}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          {CATEGORY_LABELS[product.category]}
        </span>

        {/* Product name */}
        <h3 className="text-base font-semibold text-gray-800 mb-3 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Price section */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              Rs. {product.price}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              per {UNIT_LABELS[product.unit].toLowerCase()}
            </span>
          </div>
        </div>

        {/* Quantity selector and Add to cart - only show if in stock */}
        {remainingStock > 0 ? (
          <>
            {/* Quantity selector */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-600">
                Quantity:
              </span>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => handleQuantityChange(-1)}
                onIncrease={() => handleQuantityChange(1)}
                increaseDisabled={quantity >= remainingStock}
                decreaseDisabled={quantity <= 1}
              />
            </div>

            {/* Add to cart button */}
            <motion.button
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 text-white text-sm font-medium group/btn cursor-pointer",
                isInCart
                  ? "bg-linear-to-r from-rose-500 via-rose-600 to-rose-500"
                  : "from-rose-600 via-rose-500 to-rose-600 bg-linear-to-r"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
            >
              {isInCart ? (
                <>
                  <Plus
                    className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-200"
                    strokeWidth={2.5}
                  />
                  <span>Add More</span>
                </>
              ) : (
                <>
                  <ShoppingBag
                    className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200"
                    strokeWidth={2.5}
                  />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>
          </>
        ) : (
          /* Out of stock message */
          <div className="w-full py-3 px-4 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;
