import {
  PRODUCT_UNIT,
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_WITH_ALL,
} from "@/types/enums";

export const units = [
  { id: PRODUCT_UNIT.KG, label: "Kg" },
  { id: PRODUCT_UNIT.GRAM, label: "Gram" },
  { id: PRODUCT_UNIT.LITRE, label: "Litre" },
  { id: PRODUCT_UNIT.ML, label: "ml (Millilitre)" },
  { id: PRODUCT_UNIT.PIECE, label: "Piece" },
  { id: PRODUCT_UNIT.PACK, label: "Pack" },
  { id: PRODUCT_UNIT.DOZEN, label: "Dozen" },
  { id: PRODUCT_UNIT.BUNDLE, label: "Bundle" },
  { id: PRODUCT_UNIT.BAG, label: "Bag" },
  { id: PRODUCT_UNIT.BOX, label: "Box" },
  { id: PRODUCT_UNIT.CAN, label: "Can" },
  { id: PRODUCT_UNIT.BOTTLE, label: "Bottle" },
  { id: PRODUCT_UNIT.JAR, label: "Jar" },
  { id: PRODUCT_UNIT.TUBE, label: "Tube" },
  { id: PRODUCT_UNIT.TRAY, label: "Tray" },
  { id: PRODUCT_UNIT.PACKET, label: "Packet" },
  { id: PRODUCT_UNIT.SACHET, label: "Sachet" },
  { id: PRODUCT_UNIT.ROLL, label: "Roll" },
  { id: PRODUCT_UNIT.BAR, label: "Bar" },
  { id: PRODUCT_UNIT.GALLON, label: "Gallon" },
  { id: PRODUCT_UNIT.QUART, label: "Quart" },
  { id: PRODUCT_UNIT.SERVING, label: "Serving" },
  { id: PRODUCT_UNIT.LB, label: "lb (Pound)" },
  { id: PRODUCT_UNIT.OZ, label: "oz (Ounce)" },
];
export const categories = [
  { id: PRODUCT_CATEGORY.VEGETABLES, label: "Vegetables" },
  { id: PRODUCT_CATEGORY.FRUITS, label: "Fruits" },
  { id: PRODUCT_CATEGORY.DAIRY_EGGS, label: "Dairy & Eggs" },
  { id: PRODUCT_CATEGORY.GRAINS, label: "Grains" },
  { id: PRODUCT_CATEGORY.SEAFOOD, label: "Seafood" },
  { id: PRODUCT_CATEGORY.SPICES, label: "Spices" },
  { id: PRODUCT_CATEGORY.BEVERAGES, label: "Beverages" },
  { id: PRODUCT_CATEGORY.PERSONAL_CARE, label: "Personal Care" },
  { id: PRODUCT_CATEGORY.HOUSEHOLD_ESSENTIALS, label: "Household Essentials" },
  { id: PRODUCT_CATEGORY.PACKAGED_FOOD, label: "Packaged Food" },
  { id: PRODUCT_CATEGORY.BABY_CARE, label: "Baby Care" },
  { id: PRODUCT_CATEGORY.PET_CARE, label: "Pet Care" },
  { id: PRODUCT_CATEGORY.HEALTH_AND_WELLNESS, label: "Health & Wellness" },
  { id: PRODUCT_CATEGORY.CANNED_GOODS, label: "Canned Goods" },
  { id: PRODUCT_CATEGORY.CONDIMENTS, label: "Condiments" },
  { id: PRODUCT_CATEGORY.FROZEN, label: "Frozen" },
  { id: PRODUCT_CATEGORY.OTHERS, label: "Others" },
];

export const ALL_CATEGORY = {
  id: PRODUCT_CATEGORY_WITH_ALL.ALL,
  label: "All Products",
};

export const CATEGORY_LABELS = Object.fromEntries(
  categories.map((c) => [c.id, c.label])
) as Record<(typeof categories)[number]["id"], string>;

export const UNIT_LABELS = Object.fromEntries(
  units.map((u) => [u.id, u.label])
) as Record<(typeof units)[number]["id"], string>;
