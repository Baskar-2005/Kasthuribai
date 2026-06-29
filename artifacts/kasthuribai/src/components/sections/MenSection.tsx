import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product, Color, Subcategory, Style } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenSectionProps {
  onViewProduct?: (product: Product) => void;
}

const MEN_SUBCATEGORIES: Subcategory[] = ["Shirts", "T-Shirts", "Jeans", "Formal Wear"];
const MEN_SIZES = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = ["Default", "Price: Low to High", "Price: High to Low", "Newest First"];

const TABS = [
  { id: "all",      label: "All",          emoji: "👔" },
  { id: "new",      label: "New Arrivals", emoji: "✨" },
  { id: "best",     label: "Best Sellers", emoji: "🔥" },
  { id: "trending", label: "Trending",     emoji: "⚡" },
];

export function MenSection({ onViewProduct }: MenSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "new" | "best" | "trending">("all");
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Default");
  const [showFilters, setShowFilters] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  const menProducts = useMemo(() => PRODUCTS.filter(p => p.category === "Men"), []);

  const filtered = useMemo(() => {
    let r = menProducts;
    if (activeTab === "new")      r = r.filter(p => p.isNewArrival);
    if (activeTab === "best")     r = r.filter(p => p.isBestSeller);
    if (activeTab === "trending") r = r.filter(p => p.isTrending);
    if (activeSubcat) r = r.filter(p => p.subcategory === activeSubcat);
    if (activeSize)   r = r.filter(p => p.sizes?.includes(activeSize));
    if (sortBy === "Price: Low to High")  r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low")  r = [...r].sort((a, b) => b.price - a.price);
    if (sortBy === "Newest First")         r = [...r].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    return r;
  }, [menProducts, activeTab, activeSubcat, activeSize, sortBy]);

  return (
    <section id="men" className="relative overflow-hidden">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-14 sm:py-20 overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-blue-400/30 bg-blue-400/10 text-blue-300 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4">
                <span>👔</span> Men's Collection
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-2">
                Men's <span className="text-blue-400">Wear</span>
              </h2>
              <p className="text-blue-100/60 font-body text-sm">
                Shirts · T-Shirts · Jeans · Formal Wear
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/90 font-bold text-2xl">{menProducts.length}+</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Styles</p>
              </div>
              <button
                onClick={() => window.location.href = "/collections?category=Men"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
              >
                Shop All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab pills pinned to bottom of banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5" style={{ scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap overflow-hidden border",
                  activeTab === tab.id
                    ? "bg-white text-slate-900 border-white shadow-lg"
                    : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                )}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick filters bar */}
      <div className="bg-gray-50/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Sub-category pills */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {MEN_SUBCATEGORIES.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    activeSubcat === sub
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-400"
                  )}
                >
                  {sub}
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />
              {MEN_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setActiveSize(activeSize === size ? null : size)}
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full text-xs font-bold transition-all border",
                    activeSize === size
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl pl-3 pr-7 py-2 outline-none cursor-pointer hover:border-gray-400 transition-colors"
              >
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            <span className="text-xs text-gray-400 font-body flex-shrink-0">{filtered.length} items</span>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 text-gray-400">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="font-body">No products match your filters.</p>
                <button onClick={() => { setActiveSubcat(null); setActiveSize(null); setActiveTab("all"); }} className="mt-4 text-primary text-sm font-semibold hover:underline">Clear filters</button>
              </motion.div>
            ) : (
              <motion.div key={activeTab + activeSubcat + activeSize} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onView={onViewProduct} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.href = "/collections?category=Men"}
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-900 text-slate-900 font-semibold text-sm hover:bg-slate-900 hover:text-white transition-all"
              >
                View All Men's Wear <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
