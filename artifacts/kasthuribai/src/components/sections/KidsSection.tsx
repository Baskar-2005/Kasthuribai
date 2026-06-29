import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product, Subcategory, Style, AgeRange } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KidsSectionProps {
  onViewProduct?: (product: Product) => void;
}

const KIDS_SUBCATEGORIES: Subcategory[] = ["T-Shirts", "Dresses", "Frocks", "Kurta Pajama", "Formal Wear"];
const KIDS_AGE_RANGES: AgeRange[] = ["1-3 yrs", "4-8 yrs", "9-12 yrs"];
const SORT_OPTIONS = ["Default", "Price: Low to High", "Price: High to Low", "Newest First"];

const TABS = [
  { id: "all",   label: "All",         emoji: "🧸" },
  { id: "new",   label: "New",         emoji: "✨" },
  { id: "party", label: "Party Wear",  emoji: "🎉" },
  { id: "cute",  label: "Cute Picks",  emoji: "💖" },
];

export function KidsSection({ onViewProduct }: KidsSectionProps) {
  const [activeTab, setActiveTab]       = useState<"all" | "new" | "party" | "cute">("all");
  const [activeSubcat, setActiveSubcat]  = useState<string | null>(null);
  const [activeAge, setActiveAge]        = useState<AgeRange | null>(null);
  const [sortBy, setSortBy]              = useState("Default");

  const kidsProducts = useMemo(() => PRODUCTS.filter(p => p.category === "Kids"), []);

  const filtered = useMemo(() => {
    let r = kidsProducts;
    if (activeTab === "new")   r = r.filter(p => p.isNewArrival);
    if (activeTab === "party") r = r.filter(p => p.styles?.includes("Party Wear"));
    if (activeTab === "cute")  r = r.filter(p => p.badges?.includes("Hot") || p.badges?.includes("Trending"));
    if (activeSubcat) r = r.filter(p => p.subcategory === activeSubcat);
    if (activeAge)    r = r.filter(p => p.ageRange === activeAge);
    if (sortBy === "Price: Low to High") r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") r = [...r].sort((a, b) => b.price - a.price);
    if (sortBy === "Newest First")        r = [...r].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    return r;
  }, [kidsProducts, activeTab, activeSubcat, activeAge, sortBy]);

  return (
    <section id="kids" className="relative overflow-hidden">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 py-14 sm:py-20 overflow-hidden">
        {/* Floating circles decoration */}
        <div className="absolute top-6 right-16 w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20" />
        <div className="absolute top-16 right-32 w-10 h-10 rounded-full bg-teal-400/15 border border-teal-400/20" />
        <div className="absolute bottom-8 left-16 w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/15" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-emerald-300/30 bg-emerald-300/10 text-emerald-200 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4">
                <span>🧒</span> Kids' Collection
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-2">
                Kids' <span className="text-emerald-400">Wear</span>
              </h2>
              <p className="text-emerald-100/60 font-body text-sm">
                Colorful · Comfortable · Fun for every little one
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/90 font-bold text-2xl">{kidsProducts.length}+</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Styles</p>
              </div>
              <button
                onClick={() => window.location.href = "/collections?category=Kids"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
              >
                Shop All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5" style={{ scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap border",
                  activeTab === tab.id
                    ? "bg-white text-emerald-900 border-white shadow-lg"
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
            <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {KIDS_SUBCATEGORIES.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    activeSubcat === sub
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                  )}
                >
                  {sub}
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />
              {KIDS_AGE_RANGES.map(age => (
                <button
                  key={age}
                  onClick={() => setActiveAge(activeAge === age ? null : age)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    activeAge === age
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                  )}
                >
                  {age}
                </button>
              ))}
            </div>

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
                <button onClick={() => { setActiveSubcat(null); setActiveAge(null); setActiveTab("all"); }} className="mt-4 text-primary text-sm font-semibold hover:underline">Clear filters</button>
              </motion.div>
            ) : (
              <motion.div key={activeTab + activeSubcat + activeAge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onView={onViewProduct} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.href = "/collections?category=Kids"}
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-700 text-emerald-700 font-semibold text-sm hover:bg-emerald-700 hover:text-white transition-all"
              >
                View All Kids' Wear <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
