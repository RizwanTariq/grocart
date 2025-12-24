"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Edit, Archive, PackagePlus } from "lucide-react";
import Link from "next/link";
import { IProduct } from "@/types";
import { CATEGORY_LABELS, UNIT_LABELS } from "@/constants/product";
import { cn } from "@/utils/cn";

function ProductCard({
  product,
  index,
  onArchive,
  isArchiving,
  onOpenStockModal,
}: {
  product: IProduct;
  index: number;
  onArchive: (id: string) => Promise<void>;
  isArchiving: boolean;
  onOpenStockModal: (product: IProduct) => void;
}) {
  const isLowStock = product.countInStock < 30 && product.countInStock > 0;
  const isOutOfStock = product.countInStock === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
        delay: index * 0.05,
      }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50",
        "border-gray-200/60 hover:border-gray-300/80"
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100/50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 30vw, 50vw"
          loading="eager"
        />

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gray-500 backdrop-blur-sm">
            <span className="text-xs font-semibold text-gray-50">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-amber-600 backdrop-blur-sm">
            <span className="text-xs font-semibold text-gray-50">
              Low Stock
            </span>
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 min-h-12">
            {product.name}
          </h3>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {product.price}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              per {UNIT_LABELS[product.unit].toLowerCase()}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-bold ${
                isOutOfStock
                  ? "text-rose-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {product.countInStock}
            </div>
            <div className="text-xs text-gray-500">units</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link href={`/admin/edit-product/${product._id}`} className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Edit Product
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenStockModal(product)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 font-medium text-sm transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            Update Stock
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onArchive(product._id)}
            disabled={isArchiving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            {isArchiving ? "Archiving..." : "Archive"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
