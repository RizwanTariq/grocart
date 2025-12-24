import { SortOptionId } from "@/constants/filters";
import { IProduct } from "@/types";
import { PRODUCT_CATEGORY_WITH_ALL } from "@/types/enums";

export const filterProducts = (
  products: IProduct[],
  selectedCategory: PRODUCT_CATEGORY_WITH_ALL,
  searchQuery: string
) => {
  let filtered = [...products];

  if (selectedCategory !== PRODUCT_CATEGORY_WITH_ALL.ALL) {
    filtered = filtered.filter(
      (p) =>
        (p.category as unknown as PRODUCT_CATEGORY_WITH_ALL) ===
        selectedCategory
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const sortProducts = (products: IProduct[], sortBy: SortOptionId) => {
  const sorted = [...products];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "stock-asc":
        return a.countInStock - b.countInStock;
      case "stock-desc":
        return b.countInStock - a.countInStock;
      case "date-desc":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      case "date-asc":
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  return sorted;
};
