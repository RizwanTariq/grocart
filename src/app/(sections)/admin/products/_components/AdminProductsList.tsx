"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

import { IProduct } from "@/types";
import SearchAndFiltersBar from "@/components/features/products/SearchAndFiltersBar";
import CategoryFilters from "@/components/features/products/CategoryFilters";
import ResultsSummary from "@/components/features/products/ResultSummary";
import EmptyState from "@/components/features/products/EmptyState";
import { useProducts } from "@/components/features/products/useProducts";

import StatsGrid from "./StatsGrid";
import StockUpdateModal from "./StockUpdateModal";
import ProductCard from "./ProductCard";
import { CirclePlus, Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface AdminProductsListProps {
  products: IProduct[];
}

function AdminProductsList({ products }: AdminProductsListProps) {
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

  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<IProduct | null>(
    null
  );

  const handleArchive = useCallback(async (productId: string) => {
    try {
      setArchivingId(productId);
    } catch (error) {
      console.error("Failed to archive product:", error);
    } finally {
      setArchivingId(null);
    }
  }, []);

  const lowStockCount = products.filter((p) => p.countInStock < 30).length;
  const outOfStockCount = products.filter((p) => p.countInStock === 0).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.countInStock,
    0
  );

  return (
    <div className="min-h-screen mt-15 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={CirclePlus}
          title="Product Inventory"
          subTitle="Manage and monitor your product catalog"
        >
          <Link href="/admin/products/add">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-200 cursor-pointer hover:shadow-xl hover:shadow-rose-300 transition-all "
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add New Product
            </motion.button>
          </Link>
        </PageHeader>

        <StatsGrid
          totalProducts={products.length}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
          totalValue={totalValue}
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
          {products.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-8 sm:mx-0"
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  onArchive={handleArchive}
                  isArchiving={archivingId === product._id}
                  onOpenStockModal={setStockModalProduct}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </AnimatePresence>

        {/* Stock Update Modal */}
        <AnimatePresence>
          {stockModalProduct && (
            <StockUpdateModal
              product={stockModalProduct}
              onClose={() => setStockModalProduct(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminProductsList;
