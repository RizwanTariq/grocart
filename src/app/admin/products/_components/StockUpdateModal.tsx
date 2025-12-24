import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { IProduct } from "@/types";

function StockUpdateModal({
  product,
  onClose,
  onUpdate,
}: {
  product: IProduct;
  onClose: () => void;
  onUpdate: (productId: string, newStock: number) => Promise<void>;
}) {
  const [stockValue, setStockValue] = useState(product.countInStock);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuickAdjust = (delta: number) => {
    setStockValue((prev) => Math.max(0, prev + delta));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await onUpdate(product._id, stockValue);
      onClose();
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="w-full h-full object-contain p-2"
              sizes="(max-width: 768px) 30vw, 50vw"
              loading="eager"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">
              Current Stock: {product.countInStock} units
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Update Stock Quantity
          </label>

          {/* Quick Adjust Buttons */}
          <div className="flex gap-2 mb-4">
            {[-10, -5, -1, +1, +5, +10].map((delta) => (
              <motion.button
                key={delta}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAdjust(delta)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  delta < 0
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </motion.button>
            ))}
          </div>

          {/* Stock Input */}
          <div className="relative">
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) =>
                setStockValue(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-full px-4 py-4 text-center text-3xl font-bold rounded-xl border-2 border-gray-200 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-sm text-gray-400 font-medium">units</span>
            </div>
          </div>

          {/* Stock Change Indicator */}
          {stockValue !== product.countInStock && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center"
            >
              <span
                className={`text-sm font-medium ${
                  stockValue > product.countInStock
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {stockValue > product.countInStock ? "+" : ""}
                {stockValue - product.countInStock} units
              </span>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isUpdating || stockValue === product.countInStock}
            className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Stock"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

export default StockUpdateModal;
