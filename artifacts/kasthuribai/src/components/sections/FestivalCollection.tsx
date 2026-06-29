import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product, Subcategory, Style } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FestivalCollectionProps {
  onViewProduct?: (product: Product) => void;
}

const FESTIVAL_SUBCATEGORIES: Subcategory[] = ["Sarees", "Lehengas", "Gowns", "Sherwanis", "Dhotis", "Kurta Pajama"];
const FESTIVAL_STYLES: Style[] = ["Festive", "Wedding", "Traditional", "Party Wear"];
const SORT_OPTIONS = ["Default", "Price: Low to High", "Price: High to Low", "Newest First"];

const TABS = [
  { id: "all",     label: "All",          emoji: "🎊" },
  { id: "diwali",  label: "Diwali",       emoji: "🪔" },
  { id: "pongal",  label: "Pongal",       emoji: "🌾" },
  { id: "wedding", label: "Wedding",      emoji: "💍" },
  { id: "premium", label: "Premium",      emoji: "✨" },
];

export function FestivalCollection({ onViewProduct }: FestivalCollectionProps) {
  const [activeTab, setActiveTab]       = useState<"all" | "diwali" | "pongal" | "wedding" | "premium">("all");
  const [activeSubcat, setActiveSubcat]  = useState<string | null>(null);
  const [activeStyle, setActiveStyle]    = useState<string | null>(null);
  const [sortBy, setSortBy]              = useState("Default");

  const festivalProducts = useMemo(() => PRODUCTS.filter(p => p.category === "Festive" || p.category === "Traditional"), []);

  const filtered = useMemo(() => {
    let r = festivalProducts;
    if (activeTab === "diwali")  r = r.filter(p => p.styles?.includes("Festive"));
    if (activeTab === "pongal")  r = r.filter(p => p.styles?.includes("Traditional"));
    if (activeTab === "wedding") r = r.filter(p => p.styles?.includes("Wedding"));
    if (activeTab === "premium") r = r.filter(p => p.badges?.includes("Premium"));
    if (activeSubcat) r = r.filter(p => p.subcategory === activeSubcat);
    if (activeStyle)  r = r.filter(p => p.styles?.includes(activeStyle as Style));
    if (sortBy === "Price: Low to High") r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") r = [...r].sort((a, b) => b.price - a.price);
    if (sortBy === "Newest First")        r = [...r].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    return r;
  }, [festivalProducts, activeTab, activeSubcat, activeStyle, sortBy]);

  return (
    <section id="festival" className="relative overflow-hidden">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-amber-950 via-orange-900 to-yellow-900 py-14 sm:py-20 overflow-hidden">
        {/* Decorative mandala-like rings */}
        <div className="absolute top-4 right-8 w-48 h-48 rounded-full border border-amber-400/10" />
        <div className="absolute top-8 right-12 w-36 h-36 rounded-full border border-amber-400/10" />
        <div className="absolute top-12 right-16 w-24 h-24 rounded-full border border-amber-400/15" />
        <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full border border-amber-400/10" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-orange-400/10 rounded-full blur-3xl" />

        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/5 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 text-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-3 h-3" /> Festival & Traditional
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-2">
                Celebrate in <span className="text-amber-400">Style</span>
              </h2>
              <p className="text-amber-100/60 font-body text-sm">
                Diwali · Pongal · Weddings · Every special occasion
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/90 font-bold text-2xl">{festivalProducts.length}+</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Styles</p>
              </div>
              <button
                onClick={() => window.location.href = "/collections"}
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
                    ? "bg-white text-amber-900 border-white shadow-lg"
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
              {FESTIVAL_SUBCATEGORIES.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    activeSubcat === sub
                      ? "bg-amber-700 text-white border-amber-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                  )}
                >
                  {sub}
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />
              {FESTIVAL_STYLES.map(style => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(activeStyle === style ? null : style)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    activeStyle === style
                      ? "bg-amber-700 text-white border-amber-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                  )}
                >
                  {style}
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
                <button onClick={() => { setActiveSubcat(null); setActiveStyle(null); setActiveTab("all"); }} className="mt-4 text-primary text-sm font-semibold hover:underline">Clear filters</button>
              </motion.div>
            ) : (
              <motion.div key={activeTab + activeSubcat + activeStyle} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onView={onViewProduct} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.href = "/collections"}
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-amber-700 text-amber-700 font-semibold text-sm hover:bg-amber-700 hover:text-white transition-all"
              >
                View All Festival Wear <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
