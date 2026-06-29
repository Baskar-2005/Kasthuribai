import { useMemo, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, Shield, Truck, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

import { SilverProductDetailsModal } from "@/components/silver/SilverProductDetailsModal";
import { SilverCategoryTabs, SilverCategoryGrid } from "@/components/silver/SilverCategoryTabs";
import { SilverFilterPanel } from "@/components/silver/SilverFilterPanel";
import { SilverProductGrid } from "@/components/silver/SilverProductGrid";
import { SilverMobileFilterDrawer } from "@/components/silver/SilverMobileFilterDrawer";

import { filterSilverProducts } from "@/components/silver/filtering";
import type { SilverCategoryKey, SilverProduct } from "@/data/silver-mock-data";
import { SILVER_PRODUCTS } from "@/data/silver-mock-data";
import type {
  SilverFilterPanelState,
  SilverSortKey,
  SilverCategoryTabsKey,
} from "@/components/silver/types";

// ── helpers ────────────────────────────────────────────────────────────────────
function parseWeightG(w: string) {
  const m = w.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}
function computeMinMaxWeights() {
  const vals = SILVER_PRODUCTS.map(p => parseWeightG(p.weight)).filter(n => n > 0);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}
const PURITY_MAP: Record<string, string> = {
  "925": "92.5 Hallmark Silver",
  "999": "999 Pure Silver",
  sterling: "Sterling Silver 92.5",
  hallmark: "92.5 Premium Hallmark",
};

/** Returns selected purities as a Set (empty = all). */
function getSelectedPurities(sel: SilverFilterPanelState["purity"]): Set<string> {
  return new Set(
    Object.entries(sel)
      .filter(([, v]) => v)
      .map(([k]) => PURITY_MAP[k])
      .filter(Boolean)
  );
}

function getStockFilter(sel: SilverFilterPanelState["availability"]): "all" | SilverProduct["stockStatus"] {
  if (sel.inStock)   return "In Stock";
  if (sel.lowStock)  return "Low Stock";
  if (sel.outOfStock)return "Out of Stock";
  return "all";
}
function applySort(products: SilverProduct[], key: SilverSortKey) {
  const copy = [...products];
  const score = (p: SilverProduct) => (p.isBestSeller ? 50 : 0) + (p.isNewArrival ? 25 : 0) + p.discountPct / 2;
  switch (key) {
    case "newest":      return copy.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    case "best_selling":return copy.sort((a, b) => score(b) - score(a));
    case "price_low":   return copy.sort((a, b) => a.price - b.price);
    case "price_high":  return copy.sort((a, b) => b.price - a.price);
    default:            return copy;
  }
}

const TRUST_BADGES = [
  { icon: Shield, label: "BIS Hallmark",    sub: "Certified purity" },
  { icon: Award,  label: "92.5 Pure Silver",sub: "Tested & verified"  },
  { icon: Truck,  label: "Free Delivery",   sub: "On all silver items" },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function SilverCorner() {
  const weights = useMemo(() => computeMinMaxWeights(), []);
  const purityOptions = useMemo(() => Array.from(new Set(SILVER_PRODUCTS.map(p => p.purity))), []);

  const [detailsProduct, setDetailsProduct] = useState<SilverProduct | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const blankFilters: SilverFilterPanelState = useMemo(() => ({
    categoryKey: "all",
    query: "",
    sortKey: "default",
    minPrice: 0,
    maxPrice: 100000,
    purity: { "925": false, "999": false, sterling: false, hallmark: false },
    weightMin: weights.min,
    weightMax: weights.max,
    availability: { inStock: false, outOfStock: false, lowStock: false, newArrivals: false, bestSellers: false },
    dynamic: {},
  }), [weights]);

  const [filters, setFilters] = useState<SilverFilterPanelState>(blankFilters);

  const clearAll = useCallback(() => setFilters(blankFilters), [blankFilters]);

  const products = useMemo(() => {
    const selectedPurities = getSelectedPurities(filters.purity);
    const stockFilter = getStockFilter(filters.availability);

    let result = filterSilverProducts(SILVER_PRODUCTS, {
      query: filters.query,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      // Pass "all" here; we apply purity multi-select manually below.
      purity: "all",
      weightMin: filters.weightMin,
      weightMax: filters.weightMax,
      categoryKey: filters.categoryKey === "all" ? "all" : (filters.categoryKey as SilverCategoryKey),
      hallmark: "all",
      availability: stockFilter,
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

    // Apply multi-purity filter
    if (selectedPurities.size > 0) {
      result = result.filter(p => selectedPurities.has(p.purity));
    }

    // Apply flag-based availability filters (new arrivals / best sellers)
    if (filters.availability.newArrivals) result = result.filter(p => p.isNewArrival);
    if (filters.availability.bestSellers)  result = result.filter(p => p.isBestSeller);

    return applySort(result, filters.sortKey);
  }, [filters]);

  const hasActiveFilters = filters.query ||
    filters.minPrice > 0 || filters.maxPrice < 100000 ||
    Object.values(filters.purity).some(Boolean) ||
    Object.values(filters.availability).some(Boolean) ||
    filters.categoryKey !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f6]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#111118]">
        {/* Silver shimmer background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,200,220,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_120%,rgba(180,160,100,0.08),transparent)]" />

        {/* Animated shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Premium Silver Collections</span>
            </motion.div>

            {/* Shimmer heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 leading-tight"
              style={{
                background: "linear-gradient(135deg, #e8e8e8 0%, #ffffff 30%, #c8b97a 50%, #ffffff 70%, #c0c0c0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Silver Corner
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/55 font-body text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto"
            >
              Handpicked 92.5 Hallmark silver jewellery — anklets, chains, bangles, earrings, pooja
              items &amp; gifts. Every piece certified, every price honest.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-lg mx-auto mb-10"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
              <input
                type="text"
                placeholder="Search silver jewellery…"
                value={filters.query}
                onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                className="w-full bg-white/8 backdrop-blur-md border border-white/12 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-body outline-none focus:border-white/25 focus:bg-white/10 transition-all"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters(f => ({ ...f, query: "" }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
                </button>
              )}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {TRUST_BADGES.map(b => (
                <div key={b.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                    <b.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white/90 text-xs font-bold">{b.label}</p>
                    <p className="text-white/40 text-[10px] font-body">{b.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-white/8 bg-white/[0.03]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              {[
                { num: "120+", label: "Silver Pieces" },
                { num: "10",   label: "Categories" },
                { num: "92.5%",label: "Pure Silver" },
                { num: "4.8★", label: "Avg Rating" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-white/90 font-display font-bold text-lg leading-none">{s.num}</p>
                  <p className="text-white/35 text-[10px] font-body uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* ── Category Visual Grid ──────────────────────────────────────────── */}
        <section className="py-8 sm:py-10 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">Shop by Category</h2>
                <p className="text-slate-400 text-sm font-body mt-0.5">Tap a category to filter</p>
              </div>
              {filters.categoryKey !== "all" && (
                <button
                  onClick={() => setFilters(f => ({ ...f, categoryKey: "all" }))}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
            <SilverCategoryGrid
              active={filters.categoryKey}
              onChange={key => setFilters(f => ({ ...f, categoryKey: key }))}
            />
          </div>
        </section>

        {/* ── Filter bar (mobile sticky) ───────────────────────────────────── */}
        <div className="sticky top-[62px] z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile filter trigger */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>

              {/* Category pills — scrollable */}
              <div className="flex-1 overflow-hidden">
                <SilverCategoryTabs
                  value={filters.categoryKey}
                  onChange={key => setFilters(f => ({ ...f, categoryKey: key }))}
                />
              </div>

              {/* Result count */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 font-body flex-shrink-0">
                <span className="font-bold text-slate-900">{products.length}</span> items
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile filter drawer ─────────────────────────────────────────── */}
        <SilverMobileFilterDrawer
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          state={filters}
          setState={setFilters}
          purityOptions={purityOptions}
          weightMinMax={weights}
          resultsCount={products.length}
          onClearAll={clearAll}
        />

        {/* ── Main content: sidebar + grid ────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

            {/* Sidebar filter — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-[130px]">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <SilverFilterPanel
                    state={filters}
                    setState={setFilters}
                    purityOptions={purityOptions}
                    weightMinMax={weights}
                    resultsCount={products.length}
                    onClearAll={clearAll}
                  />
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div>
              {/* Grid header */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">
                    {filters.categoryKey === "all"
                      ? "All Silver Collections"
                      : `Silver ${filters.categoryKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`}
                  </h2>
                  <p className="text-sm text-slate-400 font-body mt-0.5">
                    {products.length} item{products.length !== 1 ? "s" : ""}
                    {hasActiveFilters ? " · Filtered" : ""}
                  </p>
                </div>

                {/* Clear active filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-primary/80 transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Empty state */}
              <AnimatePresence>
                {products.length === 0 && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24"
                  >
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="font-display font-bold text-slate-900 text-xl mb-2">No results found</h3>
                    <p className="text-slate-500 font-body text-sm mb-6 max-w-xs mx-auto">
                      Try adjusting your filters or clearing the search.
                    </p>
                    <button
                      onClick={clearAll}
                      className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {products.length > 0 && (
                <SilverProductGrid products={products} onView={setDetailsProduct} />
              )}
            </div>
          </div>
        </div>

        {/* ── Silver Promise strip ──────────────────────────────────────────── */}
        <section className="border-t border-gray-100 bg-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  color: "text-blue-600 bg-blue-50",
                  title: "BIS Certified Purity",
                  desc: "Every piece is hallmarked 92.5 — tested and certified for purity before it reaches you.",
                },
                {
                  icon: Truck,
                  color: "text-emerald-600 bg-emerald-50",
                  title: "Free Delivery on Silver",
                  desc: "All silver orders ship free, securely packed to protect every delicate piece in transit.",
                },
                {
                  icon: Award,
                  color: "text-amber-600 bg-amber-50",
                  title: "Since the 1930s",
                  desc: "Three generations of trust from Chidambaram. Quality is not a policy — it's our heritage.",
                },
              ].map(b => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${b.color}`}>
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base mb-1">{b.title}</h3>
                    <p className="text-sm text-slate-500 font-body leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
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
      />
    </div>
  );
}
