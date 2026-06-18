import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

import type { SilverFilterPanelState } from "./types";
import { SilverSortKey } from "./types";

import { SILVER_PRODUCTS } from "@/data/silver-mock-data";

function parseWeightG(weight: string): number {
  const m = weight.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function SilverFilterPanel({
  state,
  setState,
  purityOptions,
  weightMinMax,
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
  // for mobile drawer actions (no-op for desktop)
  onApplyMobile?: () => void;
}) {
  const sortOptions: { key: SilverSortKey; label: string }[] = [
    { key: "default", label: "Default" },
    { key: "newest", label: "Newest First" },
    { key: "best_selling", label: "Best Selling" },
    { key: "price_low", label: "Price Low to High" },
    { key: "price_high", label: "Price High to Low" },
  ];

  const purityCheckboxes = [
    { id: "925", label: "925 Silver" },
    { id: "999", label: "999 Silver" },
    { id: "sterling", label: "Sterling Silver" },
    { id: "hallmark", label: "Hallmarked Silver" },
  ] as const;

  const weightRanges = [
    { id: "0_5", label: "0–5g", min: 0, max: 5 },
    { id: "5_10", label: "5–10g", min: 5, max: 10 },
    { id: "10_20", label: "10–20g", min: 10, max: 20 },
    { id: "20p", label: "20g+", min: 20, max: 9999 },
  ] as const;

  const availabilityCheckboxes = [
    { id: "inStock", label: "In Stock" },
    { id: "outOfStock", label: "Out of Stock" },
    { id: "newArrivals", label: "New Arrivals" },
    { id: "bestSellers", label: "Best Sellers" },
  ] as const;

  const priceQuick = [
    { id: "under500", label: "Under ₹500", min: 0, max: 500 },
    { id: "500_1000", label: "₹500–₹1000", min: 500, max: 1000 },
    { id: "1000_2000", label: "₹1000–₹2000", min: 1000, max: 2000 },
    { id: "2000_5000", label: "₹2000–₹5000", min: 2000, max: 5000 },
    { id: "5000p", label: "₹5000+", min: 5000, max: 999999 },
  ];

  const activePurity = useMemo(() => {
    const ids = Object.entries(state.purity)
      .filter(([, v]) => v)
      .map(([k]) => k);
    return ids;
  }, [state.purity]);

  return (
    <div className="w-full max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 filter-scrollbar">
      <div className="text-xs font-body font-bold text-slate-700 uppercase tracking-widest">
        Handpicked for Shine, Purity & Gifting
      </div>
      <div className="mt-1 text-sm font-body font-bold text-slate-900">Showing {resultsCount} Results</div>

      <div className="mt-5">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Sort By</p>
        <div className="mt-2">
          <select
            value={state.sortKey}
            onChange={(e) => setState({ ...state, sortKey: e.target.value as SilverSortKey })}
            className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-slate-200 bg-white"
          >
            {sortOptions.map((o) => (
              <option value={o.key} key={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Price Range</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white border border-slate-200 p-3">
            <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Min</p>
            <input
              type="number"
              value={state.minPrice}
              onChange={(e) => setState({ ...state, minPrice: Number(e.target.value || 0) })}
              className="mt-2 w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-3">
            <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Max</p>
            <input
              type="number"
              value={state.maxPrice}
              onChange={(e) => setState({ ...state, maxPrice: Number(e.target.value || 0) })}
              className="mt-2 w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {priceQuick.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setState({ ...state, minPrice: c.min, maxPrice: c.max })}
              className="px-3 py-1.5 rounded-full text-[11px] font-body font-bold border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 transition"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Purity</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {purityCheckboxes.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={state.purity[p.id]}
                onChange={(e) => setState({ ...state, purity: { ...state.purity, [p.id]: e.target.checked } })}
                className="accent-slate-900"
              />
              <span className="text-xs font-body font-bold text-slate-900">{p.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-2 text-[11px] text-slate-500 font-body">Select multiple to broaden results.</div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Weight Range</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {weightRanges.map((w) => {
            const active = state.weightMin <= w.min && state.weightMax >= w.max;
            return (
              <label
                key={w.id}
                className={
                  "flex items-center gap-2 rounded-2xl border px-3 py-2 " +
                  (active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white/70 text-slate-900")
                }
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => {
                    if (!e.target.checked) return;
                    setState({
                      ...state,
                      weightMin: w.min,
                      weightMax: w.max === 9999 ? weightMinMax.max : w.max,
                    });
                  }}
                  className="accent-slate-900"
                />
                <span className="text-xs font-body font-bold">{w.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Availability</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {availabilityCheckboxes.map((a) => (
            <label key={a.id} className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2">
              <input
                type="checkbox"
                checked={state.availability[a.id]}
                onChange={(e) => setState({ ...state, availability: { ...state.availability, [a.id]: e.target.checked } })}
                className="accent-slate-900"
              />
              <span className="text-xs font-body font-bold text-slate-900">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onClearAll}
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-3 py-3 text-sm font-body font-bold text-slate-900 hover:bg-white hover:border-slate-300 transition"
        >
          Clear All
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 font-body">
        <SlidersHorizontal className="w-3 h-3" />
        Live filters
      </div>

      {/* Mobile apply is handled by parent; this panel is desktop-first */}
      <div className="hidden" aria-hidden>
        {uniq(SILVER_PRODUCTS.map((p) => p.purity))}
        {activePurity.join(",")}
        {/* avoid rendering callbacks; hidden for unused values only */}
        {purityOptions.length}
      </div>
    </div>
  );
}

