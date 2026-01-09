"use client";

import { motion, AnimatePresence } from "motion/react";

import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types";
import CategoryFilters from "@/components/features/products/CategoryFilters";
import SearchAndFiltersBar from "@/components/features/products/SearchAndFiltersBar";

import ResultsSummary from "@/components/features/products/ResultSummary";
import EmptyState from "@/components/features/products/EmptyState";

import { useProducts } from "@/components/features/products/useProducts";
import PageHeader from "@/components/PageHeader";
import { Boxes } from "lucide-react";

function ProductsContainer({ products }: { products: IProduct[] }) {
  const {
    selectedCategory,
    searchQuery,
    sortBy,
    showFilters,
    categories,
    setShowFilters,
    clearFilters,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    filteredAndSortedProducts,
    selectedCategoryLabel,
    selectedSortLabel,
  } = useProducts({ products });

  return (
    <div className="min-h-screen mt-12 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={Boxes}
          title="Our Products"
          subTitle="Discover fresh groceries and daily essentials"
        />

        <SearchAndFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
          onToggleFilters={() => setShowFilters((prev) => !prev)}
          selectedSortLabel={selectedSortLabel}
          sortBy={sortBy}
          onSortSelect={setSortBy}
        />

        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showFilters={showFilters}
        />

        <ResultsSummary
          count={filteredAndSortedProducts.length}
          selectedCategory={selectedCategory}
          categoryLabel={selectedCategoryLabel}
        />

        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 sm:mx-0"
            >
              {filteredAndSortedProducts.map((product) => (
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
