import { useMemo, useState } from "react";

import { SlidersHorizontal, Sparkles } from "lucide-react";

import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

import { SilverProductDetailsModal } from "@/components/silver/SilverProductDetailsModal";
import { SilverCategoryTabs } from "@/components/silver/SilverCategoryTabs";
import { SilverFilterPanel } from "@/components/silver/SilverFilterPanel";
import { SilverProductGrid } from "@/components/silver/SilverProductGrid";
import { SilverMobileFilterDrawer } from "@/components/silver/SilverMobileFilterDrawer";

import { filterSilverProducts } from "@/components/silver/filtering";

import type { SilverCategoryKey, SilverProduct } from "@/data/silver-mock-data";
import { SILVER_PRODUCTS } from "@/data/silver-mock-data";

import type { SilverFilterPanelState, SilverSortKey, SilverCategoryTabsKey } from "@/components/silver/types";

function parseWeightG(weight: string): number {
  const m = weight.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function computeMinMaxWeights(): { min: number; max: number } {
  const vals = SILVER_PRODUCTS.map((p) => parseWeightG(p.weight)).filter((n) => n > 0);
  return {
    min: Math.min(...vals),
    max: Math.max(...vals),
  };
}

function getPurityStringFromSelection(sel: SilverFilterPanelState["purity"]): string | "all" {
  const picks = Object.entries(sel)
    .filter(([, v]) => v)
    .map(([k]) => k);

  if (picks.length === 0 || picks.length === 4) return "all";

  const first = picks[0];
  if (first === "925") return "92.5 Hallmark Silver";
  if (first === "999") return "999 Pure Silver";
  if (first === "sterling") return "Sterling Silver 92.5";
  if (first === "hallmark") return "92.5 Premium Hallmark";
  return "all";
}

function getAvailabilityStringFromSelection(
  sel: SilverFilterPanelState["availability"]
): "all" | SilverProduct["stockStatus"] {
  const picks = Object.entries(sel)
    .filter(([, v]) => v)
    .map(([k]) => k);

  if (picks.length === 0 || picks.length === 4) return "all";

  const first = picks[0];
  if (first === "inStock") return "In Stock";
  if (first === "lowStock") return "Low Stock";
  if (first === "outOfStock") return "Out of Stock";
  return "all";
}

function applySort(products: SilverProduct[], sortKey: SilverSortKey): SilverProduct[] {
  const copy = [...products];

  const score = (x: SilverProduct) => {
    let s = 0;
    if (x.isBestSeller) s += 50;
    if (x.isNewArrival) s += 25;
    if (x.discountPct > 0) s += x.discountPct / 2;
    return s;
  };

  switch (sortKey) {
    case "default":
      return copy;
    case "newest":
      return copy.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    case "best_selling":
      return copy.sort((a, b) => score(b) - score(a));
    case "price_low":
      return copy.sort((a, b) => a.price - b.price);
    case "price_high":
      return copy.sort((a, b) => b.price - a.price);
    default:
      return copy;
  }
}

export default function SilverCorner() {
  const weights = useMemo(() => computeMinMaxWeights(), []);
  const [detailsProduct, setDetailsProduct] = useState<SilverProduct | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


  const initialState: SilverFilterPanelState = useMemo(() => {
    return {
      categoryKey: "all" as SilverCategoryTabsKey,
      query: "",
      sortKey: "default",

      minPrice: 0,
      maxPrice: 100000,

      purity: { "925": false, "999": false, sterling: false, hallmark: false },

      weightMin: weights.min,
      weightMax: weights.max,

      availability: {
        inStock: false,
        outOfStock: false,
        lowStock: false,
        newArrivals: false,
        bestSellers: false,
      },

      dynamic: {},
    };
  }, [weights.max, weights.min]);

  const [filters, setFilters] = useState<SilverFilterPanelState>(initialState);

  const purityOptions = useMemo(() => {
    return Array.from(new Set(SILVER_PRODUCTS.map((p) => p.purity)));
  }, []);

  const baseFiltered = useMemo(() => {
    const mappedPurity = getPurityStringFromSelection(filters.purity);
    const mappedAvailability = getAvailabilityStringFromSelection(filters.availability);

    const results = filterSilverProducts(SILVER_PRODUCTS, {
      query: filters.query,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      purity: mappedPurity,
      weightMin: filters.weightMin,
      weightMax: filters.weightMax,
      categoryKey:
        filters.categoryKey === "all" ? "all" : (filters.categoryKey as SilverCategoryKey),
      hallmark: "all",
      availability: mappedAvailability === "all" ? "all" : mappedAvailability,
      ringSize: "all",
      gender: "all",
      designType: "all",
      chainLength: "all",
      chainStyle: "all",
      sizeLength: "all",
      pattern: "all",
      weightBand: "all",
      priceBand: "all",
    });

    return applySort(results, filters.sortKey);
  }, [filters, purityOptions]);

  const count = baseFiltered.length;
  const categoryTabsValue = filters.categoryKey;

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <Navbar />



      <main className="flex-1">
        <SilverMobileFilterDrawer
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          state={filters}
          setState={setFilters}
          purityOptions={purityOptions}
          weightMinMax={weights}
          resultsCount={count}
          onClearAll={() =>
            setFilters((prev) => ({
              ...prev,
              query: "",
              minPrice: 0,
              maxPrice: 100000,
              purity: { "925": false, "999": false, sterling: false, hallmark: false },
              weightMin: weights.min,
              weightMax: weights.max,
              availability: {
                inStock: false,
                outOfStock: false,
                lowStock: false,
                newArrivals: false,
                bestSellers: false,
              },
              sortKey: "default",
            }))
          }
        />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),rgba(240,240,255,0.2)_40%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(236,236,255,0.85),rgba(255,255,255,0.9))]" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-slate-50/60 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200 backdrop-blur">
                  <Sparkles className="w-4 h-4 text-slate-700" />
                  <span className="text-xs sm:text-sm font-body font-bold text-slate-700 uppercase tracking-widest">
                    Premium Silver Collections
                  </span>
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                  Handpicked for Shine, Purity &amp; Gifting
                </h1>

                <p className="mt-3 text-sm sm:text-base font-body text-slate-700 max-w-xl">
                  Showing {count} results
                </p>
              </div>

              <div className="hidden lg:flex flex-col items-end gap-3">
                <div className="rounded-2xl bg-white/70 border border-slate-200 p-4 shadow-sm">
                  <div className="text-xs font-body font-bold text-slate-700 uppercase tracking-widest">
                    Collection Highlights
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 font-body font-bold">
                    <SlidersHorizontal className="w-4 h-4" />
                    Instant filters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sticky category tabs: visible while scrolling products */}
          <div className="sticky top-[60px] z-40 pt-4 pb-6">
            <div className="bg-white/95 rounded-3xl border border-slate-200/70 backdrop-blur p-3 shadow-sm">
              <SilverCategoryTabs
                value={categoryTabsValue}
                onChange={(next) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryKey: next,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 py-8">

            <aside className="hidden lg:block">
              <div className="sticky top-40">
                <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm mt-2 mr-1">
                  <SilverFilterPanel
                    state={filters}
                    setState={setFilters}
                    purityOptions={purityOptions}
                    weightMinMax={weights}
                    resultsCount={count}
                    onClearAll={() =>
                      setFilters((prev) => ({
                        ...prev,
                        query: "",
                        minPrice: 0,
                        maxPrice: 100000,
                        purity: { "925": false, "999": false, sterling: false, hallmark: false },
                        weightMin: weights.min,
                        weightMax: weights.max,
                        availability: {
                          inStock: false,
                          outOfStock: false,
                          lowStock: false,
                          newArrivals: false,
                          bestSellers: false,
                        },
                        sortKey: "default",
                      }))}
                  />
                </div>
              </div>
            </aside>

            <div>
              <div className="lg:hidden mb-4">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <div className="text-xs font-body font-bold text-slate-700 uppercase tracking-widest">
                    Mobile Filters
                  </div>
                  <p className="mt-1 text-sm text-slate-600 font-body font-semibold">
                    Use sidebar on desktop. Mobile drawer can be added later.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-xl">
                    Premium Silver Collections
                  </h2>
                  <p className="text-xs text-slate-600 font-body">
                    Clean, curated pieces with shine-first quality.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filters button */}
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-2 text-xs font-body font-bold text-slate-900 hover:bg-white hover:border-slate-300 transition md:hidden"
                  >
                    <span className="text-[13px]">filters</span>
                  </button>

                  <div className="text-xs font-body font-bold text-slate-600">{count} Results</div>

                </div>
              </div>

              <SilverProductGrid products={baseFiltered} onView={setDetailsProduct} />

            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <CartToast />
      <FloatingWhatsApp />

      <SilverProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onSelectProduct={setDetailsProduct}
        renderWhatsApp={() => null}
      />
    </div>
  );
}

