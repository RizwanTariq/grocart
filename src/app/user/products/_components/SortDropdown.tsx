"use client";

import { motion, AnimatePresence } from "motion/react";

import { SORT_OPTIONS, SortOptionId } from "./ProductsContainer";
import { ChevronDown } from "lucide-react";

function SortDropdown({
  isOpen,
  onToggle,
  selectedLabel,
  selectedId,
  onSelect,
}: {
  isOpen: boolean;
  onToggle: () => void;
  selectedLabel: string | undefined;
  selectedId: SortOptionId;
  onSelect: (id: SortOptionId) => void;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="w-full sm:w-auto flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all"
      >
        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onToggle} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-56 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-100 py-2 z-20"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm ${
                    selectedId === option.id
                      ? "bg-rose-50 text-rose-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SortDropdown;
