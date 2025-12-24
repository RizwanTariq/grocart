const SORT_OPTIONS = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "price-asc", label: "Price (Low to High)" },
  { id: "price-desc", label: "Price (High to Low)" },
  { id: "stock-asc", label: "Stock (Low to High)" },
  { id: "stock-desc", label: "Stock (High to Low)" },
  { id: "date-desc", label: "Newest First" },
  { id: "date-asc", label: "Oldest First" },
] as const;

export const SORT_OPTIONS_ADMIN = SORT_OPTIONS;
export const SORT_OPTIONS_USER = SORT_OPTIONS.slice(0, 6);

export type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];
