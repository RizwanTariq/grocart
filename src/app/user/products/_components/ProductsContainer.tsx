"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { categories as categoriesList } from "@/constants/product";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types";

import EmptyState from "./EmptyState";
import CategoryFilters from "./CategoryFilters";
import SearchAndFiltersBar from "./SearchAndFiltersBar";
import PageHeader from "./PageHeader";

export const SORT_OPTIONS = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "price-asc", label: "Price (Low to High)" },
  { id: "price-desc", label: "Price (High to Low)" },
  { id: "stock-desc", label: "Stock (High to Low)" },
] as const;

export type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

const ALL_CATEGORY = { id: "ALL", label: "All Products" };

function ProductsContainer({ products }: { products: IProduct[] }) {
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category") ?? "ALL";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionId>("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categories = useMemo(() => [ALL_CATEGORY, ...categoriesList], []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-desc":
          return b.countInStock - a.countInStock;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const selectedCategoryLabel = categories.find(
    (c) => c.id === selectedCategory
  )?.label;

  const selectedSortLabel = SORT_OPTIONS.find((s) => s.id === sortBy)?.label;

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  }, []);

  const handleSortSelect = useCallback((id: SortOptionId) => {
    setSortBy(id);
    setShowSortDropdown(false);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const toggleSortDropdown = useCallback(() => {
    setShowSortDropdown((prev) => !prev);
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        <SearchAndFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
          onToggleFilters={toggleFilters}
          showSortDropdown={showSortDropdown}
          onToggleSortDropdown={toggleSortDropdown}
          selectedSortLabel={selectedSortLabel}
          sortBy={sortBy}
          onSortSelect={handleSortSelect}
        />

        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showFilters={showFilters}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4 sm:mb-6 flex items-center justify-between"
        >
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredAndSortedProducts.length}
            </span>{" "}
            {filteredAndSortedProducts.length === 1 ? "product" : "products"}{" "}
            found
            {selectedCategory !== "ALL" && selectedCategoryLabel && (
              <span className="text-gray-500"> in {selectedCategoryLabel}</span>
            )}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 sm:mx-0"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProductsContainer;
