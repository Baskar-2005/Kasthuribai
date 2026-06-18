import type { SilverCategoryKey, SilverProduct } from "@/data/silver-mock-data";

export type SilverCategoryTabsKey = "all" | SilverCategoryKey;

export type SilverSortKey =
  | "default"
  | "newest"
  | "best_selling"
  | "price_low"
  | "price_high";

export type SilverFilterPanelState = {
  categoryKey: SilverCategoryTabsKey;

  // global search
  query: string;

  // sort
  sortKey: SilverSortKey;

  // price
  minPrice: number;
  maxPrice: number;

  // purity
  purity: {
    "925": boolean;
    "999": boolean;
    "sterling": boolean;
    hallmark: boolean;
  };

  // weight (grams) - we map using parsed weight from product.weight
  weightMin: number;
  weightMax: number;

  // availability
  availability: {
    inStock: boolean;
    outOfStock: boolean;
    lowStock: boolean;
    newArrivals: boolean;
    bestSellers: boolean;
  };

  // dynamic category filters UI-only (kept for layout parity; demo dataset does not map these)
  dynamic: Record<string, string>;
};

export type SilverUiProduct = SilverProduct;

