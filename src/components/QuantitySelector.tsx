"use client";
import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  increaseDisabled: boolean;
  decreaseDisabled: boolean;
};
function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  increaseDisabled,
  decreaseDisabled,
}: Props) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={decreaseDisabled}
        className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        onClick={() => onDecrease()}
      >
        <Minus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2.5} />
      </motion.button>

      <span className="w-8 text-center text-sm font-semibold text-gray-800">
        {quantity}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={increaseDisabled}
        className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        onClick={() => onIncrease()}
      >
        <Plus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

export default QuantitySelector;
