"use client";

import { motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";

import { SortOptionId } from "@/constants/filters";

import SearchInput from "./SearchInput";
import SortDropdown from "./SortDropdown";
import { useState } from "react";

function SearchAndFiltersBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onToggleFilters,
  selectedSortLabel,
  sortBy,
  onSortSelect,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onToggleFilters: () => void;
  selectedSortLabel: string | undefined;
  sortBy: SortOptionId;
  onSortSelect: (id: SortOptionId) => void;
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const handleSelect = (id: SortOptionId) => {
    onSortSelect(id);
    setShowSortDropdown(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-4 sm:mb-8 space-y-3 sm:space-y-0 sm:flex sm:gap-3"
    >
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onClearSearch}
      />

      <div className="flex gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleFilters}
          className="sm:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-700 text-sm">Filters</span>
        </motion.button>

        <div className="flex-1 sm:flex-none">
          <SortDropdown
            isOpen={showSortDropdown}
            onToggle={() => setShowSortDropdown((prev) => !prev)}
            selectedLabel={selectedSortLabel}
            selectedId={sortBy}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SearchAndFiltersBar;
