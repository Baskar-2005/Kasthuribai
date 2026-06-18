import { SILVER_PRODUCTS } from "@/data/silver-mock-data";

export type ParseableWeight = {
  weight: string;
};

function parseWeightG(weight: string): number {
  const m = weight.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

// Keep the signature compatible with the old SilverFiltersBar filtering function.
// Importantly: ONLY this pure filtering logic is reused; no SilverFiltersBar UI remains.
export type SilverFiltersState = {
  query: string;
  minPrice: number;
  maxPrice: number;
  purity: string | "all";
  weightMin: number;
  weightMax: number;
  // Level-1 selection
  categoryKey: import("@/data/silver-mock-data").SilverCategoryKey | "all";
  // Level-2 dynamic filters (UI-only demo)
  hallmark: string | "all";
  availability: "all" | import("@/data/silver-mock-data").SilverProduct["stockStatus"];
  // category-specific placeholders
  ringSize: string | "all";
  gender: string | "all";
  designType: string | "all";
  chainLength: string | "all";
  chainStyle: string | "all";
  sizeLength: string | "all";
  pattern: string | "all";
  weightBand: string | "all";
  priceBand: string | "all";
};

export function filterSilverProducts(
  products: import("@/data/silver-mock-data").SilverProduct[],
  state: SilverFiltersState
) {
  const q = state.query.trim().toLowerCase();

  return products
    .filter((p) => (state.categoryKey === "all" ? true : p.categoryKey === state.categoryKey))
    .filter((p) => p.price >= state.minPrice && p.price <= state.maxPrice)
    .filter((p) => (state.purity === "all" ? true : p.purity === state.purity))
    .filter((p) => {
      const w = parseWeightG(p.weight);
      return w >= state.weightMin && w <= state.weightMax;
    })
    .filter((p) => {
      if (state.availability === "all") return true;
      return p.stockStatus === state.availability;
    })
    .filter((p) => {
      if (!q) return true;
      const hay = [p.name, p.categoryTitle, p.purity, p.weight, p.description, ...(p.searchTags ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => {
      const score = (x: import("@/data/silver-mock-data").SilverProduct) => {
        let s = 0;
        if (x.isBestSeller) s += 50;
        if (x.isNewArrival) s += 25;
        if (x.discountPct > 0) s += x.discountPct / 2;
        return s;
      };
      return score(b) - score(a);
    });
}

