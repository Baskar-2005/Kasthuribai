import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { SilverFilterPanelState, SilverSortKey } from "./types";
import { SILVER_CATEGORIES } from "@/data/silver-mock-data";
import { cn } from "@/lib/utils";

const sortOptions: { key: SilverSortKey; label: string }[] = [
  { key: "default",      label: "Featured"            },
  { key: "newest",       label: "Newest First"        },
  { key: "best_selling", label: "Best Selling"        },
  { key: "price_low",    label: "Price: Low to High"  },
  { key: "price_high",   label: "Price: High to Low"  },
];

const priceQuick = [
  { id: "under1000",  label: "Under ₹1,000",    min: 0,    max: 1000   },
  { id: "1k_2k",      label: "₹1,000 – ₹2,000", min: 1000, max: 2000   },
  { id: "2k_3k",      label: "₹2,000 – ₹3,000", min: 2000, max: 3000   },
  { id: "3k_5k",      label: "₹3,000 – ₹5,000", min: 3000, max: 5000   },
  { id: "5kplus",     label: "₹5,000+",          min: 5000, max: 999999 },
];

const purityOptions = [
  { id: "925" as const,      label: "925 Silver"      },
  { id: "999" as const,      label: "999 Pure Silver" },
  { id: "sterling" as const, label: "Sterling Silver" },
  { id: "hallmark" as const, label: "Hallmarked"      },
];

const availabilityOptions = [
  { id: "inStock" as const,     label: "In Stock"     },
  { id: "newArrivals" as const, label: "New Arrivals" },
  { id: "bestSellers" as const, label: "Best Sellers" },
  { id: "lowStock" as const,    label: "Low Stock"    },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-0">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full text-left py-1 group">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 group-hover:text-slate-600 transition-colors">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SilverFilterPanel({
  state,
  setState,
  resultsCount,
  onClearAll,
  onApplyMobile,
}: {
  state: SilverFilterPanelState;
  setState: (next: SilverFilterPanelState) => void;
  purityOptions: string[];
  weightMinMax: { min: number; max: number };
  resultsCount: number;
  onClearAll: () => void;
  onApplyMobile?: () => void;
}) {
  const activePriceQuick = priceQuick.find(p => p.min === state.minPrice && p.max === state.maxPrice);
  const activeCategory = state.categoryKey !== "all"
    ? SILVER_CATEGORIES.find(c => c.key === state.categoryKey)
    : null;

  const togglePurity = (id: keyof SilverFilterPanelState["purity"]) =>
    setState({ ...state, purity: { ...state.purity, [id]: !state.purity[id] } });

  const toggleAvailability = (id: keyof SilverFilterPanelState["availability"]) =>
    setState({ ...state, availability: { ...state.availability, [id]: !state.availability[id] } });

  const anyActive = Object.values(state.purity).some(Boolean)
    || Object.values(state.availability).some(Boolean)
    || state.minPrice > 0 || state.maxPrice < 999999
    || state.sortKey !== "default";

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header - sticky */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-3 border-b border-slate-100">
        <div>
          <p className="font-bold text-slate-900 text-sm">Filters</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{resultsCount} results</p>
        </div>
        {anyActive && (
          <button onClick={onClearAll} className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div
        className="flex-1 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent", maxHeight: "calc(100vh - 200px)" }}
      >
        {/* Dynamic category banner — animates when a category is selected */}
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory.key}
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{activeCategory.emoji}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Browsing</span>
                  </div>
                  <p className="text-white font-display font-bold text-sm leading-snug">{activeCategory.title}</p>
                  <p className="text-white/40 text-[10px] font-body mt-0.5">{activeCategory.subtitle}</p>
                  <button
                    onClick={() => setState({ ...state, categoryKey: "all" })}
                    className="mt-2.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    ✕ Clear category
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-cat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <p className="text-[10px] text-slate-400 font-body text-center">Select a category above to browse</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort */}
        <FilterSection title="Sort by">
          <div className="flex flex-col gap-1">
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setState({ ...state, sortKey: opt.key })}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  state.sortKey === opt.key ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {opt.label}
                {state.sortKey === opt.key && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price Range">
          <div className="flex flex-col gap-1 mb-3">
            {priceQuick.map(p => {
              const active = activePriceQuick?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setState({ ...state, minPrice: p.min, maxPrice: p.max })}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
                    active ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {p.label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Min ₹</label>
              <input
                type="number" value={state.minPrice}
                onChange={e => setState({ ...state, minPrice: Number(e.target.value || 0) })}
                className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Max ₹</label>
              <input
                type="number" value={state.maxPrice === 999999 ? "" : state.maxPrice}
                onChange={e => setState({ ...state, maxPrice: Number(e.target.value || 999999) })}
                placeholder="No limit"
                className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-slate-200 bg-white"
              />
            </div>
          </div>
        </FilterSection>

        {/* Purity */}
        <FilterSection title="Silver Purity">
          <div className="grid grid-cols-2 gap-1.5">
            {purityOptions.map(p => {
              const checked = state.purity[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => togglePurity(p.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                    checked ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className={cn("w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors", checked ? "border-white bg-amber-400" : "border-slate-300")}>
                    {checked && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <div className="grid grid-cols-2 gap-1.5">
            {availabilityOptions.map(a => {
              const checked = state.availability[a.id];
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAvailability(a.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                    checked ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className={cn("w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors", checked ? "border-white bg-amber-400" : "border-slate-300")}>
                    {checked && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                  </span>
                  {a.label}
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {onApplyMobile && (
        <button
          onClick={onApplyMobile}
          className="mt-4 w-full bg-slate-900 text-white py-3.5 rounded-2xl font-semibold text-sm"
        >
          Show {resultsCount} Results
        </button>
      )}
    </div>
  );
}
