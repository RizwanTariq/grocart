"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { IProduct } from "@/types/dto";
import { CATEGORY_LABELS, UNIT_LABELS } from "@/constants/product";
import { ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";

function ProductCard({ product }: { product: IProduct }) {
  const [isLiked, setIsLiked] = useState(false);

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

      {/* Image container - clean and spacious */}
      <div className="relative w-full aspect-square bg-gray-50/50 overflow-hidden">
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

        {/* Add to cart button - sleek design */}
        <motion.button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-800 hover:bg-rose-700 transition-colors duration-200 text-white text-sm font-medium group/btn cursor-pointer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBag
            className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200"
            strokeWidth={3}
          />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
