import type { SilverFilterPanelState, SilverSortKey } from "./types";

const sortOptions: { key: SilverSortKey; label: string }[] = [
  { key: "default",      label: "Featured"            },
  { key: "newest",       label: "Newest First"        },
  { key: "best_selling", label: "Best Selling"        },
  { key: "price_low",    label: "Price: Low to High"  },
  { key: "price_high",   label: "Price: High to Low"  },
];

const priceQuick = [
  { id: "under1000",  label: "Under ₹1,000",   min: 0,    max: 1000   },
  { id: "1k_2k",      label: "₹1,000–₹2,000",  min: 1000, max: 2000   },
  { id: "2k_3k",      label: "₹2,000–₹3,000",  min: 2000, max: 3000   },
  { id: "3k_5k",      label: "₹3,000–₹5,000",  min: 3000, max: 5000   },
  { id: "5kplus",     label: "₹5,000+",         min: 5000, max: 999999 },
];

const purityOptions = [
  { id: "925" as const,      label: "925 Silver"      },
  { id: "999" as const,      label: "999 Pure Silver" },
  { id: "sterling" as const, label: "Sterling Silver" },
  { id: "hallmark" as const, label: "Hallmarked"      },
];

const availabilityOptions = [
  { id: "inStock" as const,    label: "In Stock"      },
  { id: "newArrivals" as const,label: "New Arrivals"  },
  { id: "bestSellers" as const,label: "Best Sellers"  },
  { id: "lowStock" as const,   label: "Low Stock"     },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">{title}</p>
      {children}
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
  const activePriceQuick = priceQuick.find(
    (p) => p.min === state.minPrice && p.max === state.maxPrice
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-display font-bold text-slate-900 text-base">Filters</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">{resultsCount} results</p>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Sort */}
      <Section title="Sort by">
        <div className="flex flex-col gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setState({ ...state, sortKey: opt.key })}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                state.sortKey === opt.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {opt.label}
              {state.sortKey === opt.key && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <div className="flex flex-col gap-1.5 mb-3">
          {priceQuick.map((p) => {
            const active = activePriceQuick?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setState({ ...state, minPrice: p.min, maxPrice: p.max })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p.label}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {/* Custom min/max */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Min ₹</label>
            <input
              type="number"
              value={state.minPrice}
              onChange={(e) => setState({ ...state, minPrice: Number(e.target.value || 0) })}
              className="w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200 bg-white"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Max ₹</label>
            <input
              type="number"
              value={state.maxPrice}
              onChange={(e) => setState({ ...state, maxPrice: Number(e.target.value || 100000) })}
              className="w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200 bg-white"
              placeholder="100000"
            />
          </div>
        </div>
      </Section>

      {/* Purity */}
      <Section title="Silver Purity">
        <div className="grid grid-cols-2 gap-2">
          {purityOptions.map((p) => {
            const checked = state.purity[p.id];
            return (
              <button
                key={p.id}
                onClick={() => setState({ ...state, purity: { ...state.purity, [p.id]: !checked } })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  checked
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  checked ? "border-white bg-amber-400" : "border-slate-300"
                }`}>
                  {checked && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                </span>
                {p.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability">
        <div className="grid grid-cols-2 gap-2">
          {availabilityOptions.map((a) => {
            const checked = state.availability[a.id];
            return (
              <button
                key={a.id}
                onClick={() => setState({ ...state, availability: { ...state.availability, [a.id]: !checked } })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  checked
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  checked ? "border-white bg-amber-400" : "border-slate-300"
                }`}>
                  {checked && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                </span>
                {a.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Mobile apply */}
      {onApplyMobile && (
        <button
          onClick={onApplyMobile}
          className="w-full mt-2 bg-slate-900 text-white py-3.5 rounded-2xl font-semibold text-sm"
        >
          Show {resultsCount} Results
        </button>
      )}
    </div>
  );
}
