"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { IProduct } from "@/types/dto";
import { CATEGORY_LABELS, UNIT_LABELS } from "@/constants/product";
import { ShoppingBag, Heart, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/utils/cn";

function ProductCard({ product }: { product: IProduct }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const [isLiked, setIsLiked] = useState(false);
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

  const isLowStock = remainingStock < 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/60 hover:border-gray-300/80 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50"
    >
      {/* Like button - minimalist */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-white"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isLiked ? "fill-rose-500 stroke-rose-500" : "stroke-gray-400"
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

      {/* Image container - clean and spacious */}
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
      </div>

      {/* Content - refined spacing */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category - subtle */}
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          {CATEGORY_LABELS[product.category]}
        </span>

        {/* Product name - clear hierarchy */}
        <h3 className="text-base font-semibold text-gray-800 mb-3 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Price section - elegant */}
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
            {/* Quantity selector - sleek design */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-600">
                Quantity:
              </span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <Minus
                    className="w-3.5 h-3.5 text-gray-600"
                    strokeWidth={2.5}
                  />
                </motion.button>

                <span className="w-10 text-center text-sm font-semibold text-gray-800">
                  {quantity}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= remainingStock}
                  className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <Plus
                    className="w-3.5 h-3.5 text-gray-600"
                    strokeWidth={2.5}
                  />
                </motion.button>
              </div>
            </div>

            {/* Add to cart button - sleek design */}
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-800 hover:bg-rose-700 transition-colors duration-200 text-white text-sm font-medium group/btn cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
            >
              <ShoppingBag
                className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200"
                strokeWidth={3}
              />
              <span>Add to Cart</span>
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
