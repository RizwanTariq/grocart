export const units = [
  { id: "KG", label: "Kg" },
  { id: "GRAM", label: "Gram" },
  { id: "LITRE", label: "Litre" },
  { id: "ML", label: "ml (Millilitre)" },
  { id: "PIECE", label: "Piece" },
  { id: "PACK", label: "Pack" },
  { id: "DOZEN", label: "Dozen" },
  { id: "BUNDLE", label: "Bundle" },
  { id: "BAG", label: "Bag" },
  { id: "BOX", label: "Box" },
  { id: "CAN", label: "Can" },
  { id: "BOTTLE", label: "Bottle" },
  { id: "JAR", label: "Jar" },
  { id: "TUBE", label: "Tube" },
  { id: "TRAY", label: "Tray" },
  { id: "PACKET", label: "Packet" },
  { id: "SACHET", label: "Sachet" },
  { id: "ROLL", label: "Roll" },
  { id: "BAR", label: "Bar" },
  { id: "GALLON", label: "Gallon" },
  { id: "QUART", label: "Quart" },
  { id: "SERVING", label: "Serving" },
  { id: "LB", label: "lb (Pound)" },
  { id: "OZ", label: "oz (Ounce)" },
];
export const categories = [
  { id: "VAGETABLES", label: "Vegetables" },
  { id: "FRUITS", label: "Fruits" },
  { id: "DAIRY_EGGS", label: "Dairy & Eggs" },
  { id: "GRAINS", label: "Grains" },
  { id: "SEAFOOD", label: "Seafood" },
  { id: "SPICES", label: "Spices" },
  { id: "BAVERAGES", label: "Beverages" },
  { id: "PERSONAL_CARE", label: "Personal Care" },
  { id: "HOUSEHOLD_ESSENTIALS", label: "Household Essentials" },
  { id: "PACKAGED_FOOD", label: "Packaged Food" },
  { id: "BABY_CARE", label: "Baby Care" },
  { id: "PET_CARE", label: "Pet Care" },
  { id: "HEALTH_AND_WELLNESS", label: "Health & Wellness" },
  { id: "CANNED_GOODS", label: "Canned Goods" },
  { id: "CONDIMENTS", label: "Condiments" },
  { id: "FROZEN", label: "Frozen" },
  { id: "OTHERS", label: "Others" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  categories.map((c) => [c.id, c.label])
) as Record<(typeof categories)[number]["id"], string>;

export const UNIT_LABELS = Object.fromEntries(
  units.map((u) => [u.id, u.label])
) as Record<(typeof units)[number]["id"], string>;
