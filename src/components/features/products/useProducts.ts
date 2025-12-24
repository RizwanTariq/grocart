"use client";

import { SORT_OPTIONS_ADMIN, SortOptionId } from "@/constants/filters";
import { PRODUCT_CATEGORY_WITH_ALL } from "@/types/enums";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  ALL_CATEGORY,
  categories as categoriesList,
} from "@/constants/product";
import { filterProducts, sortProducts } from "./utils";
import { IProduct } from "@/types";

function useProducts({ products }: { products: IProduct[] }) {
  const searchParams = useSearchParams();

  const categoryFromUrl =
    (searchParams.get("category") as PRODUCT_CATEGORY_WITH_ALL) ??
    PRODUCT_CATEGORY_WITH_ALL.ALL;
  const [selectedCategory, setSelectedCategory] =
    useState<PRODUCT_CATEGORY_WITH_ALL>(categoryFromUrl);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionId>("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const categories = useMemo(() => [ALL_CATEGORY, ...categoriesList], []);
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products, selectedCategory, searchQuery);
    return sortProducts(filtered, sortBy);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const selectedCategoryLabel = categories.find(
    (c) => c.id === selectedCategory
  )?.label;

  const selectedSortLabel = SORT_OPTIONS_ADMIN.find(
    (s) => s.id === sortBy
  )?.label;
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(PRODUCT_CATEGORY_WITH_ALL.ALL);
  }, []);
  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    clearFilters,
    categories,
    filteredAndSortedProducts,
    selectedCategoryLabel,
    selectedSortLabel,
  };
}

export { useProducts };
