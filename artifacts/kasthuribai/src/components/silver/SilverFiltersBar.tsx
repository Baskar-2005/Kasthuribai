import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

import { SILVER_CATEGORIES, type SilverCategoryKey, type SilverProduct } from "@/data/silver-mock-data";

export type SilverFiltersState = {
  query: string;
  minPrice: number;
  maxPrice: number;
  purity: string | "all";
  weightMin: number;
  weightMax: number;
  // Level-1 selection
  categoryKey: SilverCategoryKey | "all";
  // Level-2 dynamic filters (UI-driven; for now only some map to existing product fields)
  hallmark: string | "all";
  availability: "all" | SilverProduct["stockStatus"];
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

function parseWeightG(weight: string): number {
  const m = weight.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

export function filterSilverProducts(products: SilverProduct[], state: SilverFiltersState) {
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
      const score = (x: SilverProduct) => {
        let s = 0;
        if (x.isBestSeller) s += 50;
        if (x.isNewArrival) s += 25;
        if (x.discountPct > 0) s += x.discountPct / 2;
        return s;
      };
      return score(b) - score(a);
    });
}

function SegmentedCategoryButton({
  emoji,
  title,
  subtitle,
  active,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-lg"
          : "border-slate-200 bg-white/70 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="text-xl">{emoji}</div>
      <div className="mt-2 text-sm font-body font-bold">{title}</div>
      <div className={`mt-1 text-[11px] font-body ${active ? "text-white/80" : "text-slate-600"}`}>{subtitle}</div>
    </button>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2 border border-slate-200 bg-white/70 hover:bg-white transition"
      >
        <span className="text-sm font-body font-bold text-slate-900">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
      </button>
      {open ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

function SelectPill({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-3">
      <p className="text-[11px] text-slate-600 font-body font-bold uppercase">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-slate-200 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SilverFiltersBar({
  state,
  setState,
  purityOptions,
  allWeights,
  onPickCategory,
  resultsCount,
}: {
  state: SilverFiltersState;
  setState: (next: SilverFiltersState) => void;
  purityOptions: string[];
  allWeights: { min: number; max: number };
  onPickCategory: (next: SilverCategoryKey) => void;
  resultsCount: number;
}) {
  const [openBlock, setOpenBlock] = useState<string>("essentials");

  const activeCategory = state.categoryKey;
  const categoryKey = activeCategory === "all" ? "rings" : activeCategory;

  const category = useMemo(() => {
    return SILVER_CATEGORIES.find((c) => c.key === categoryKey) ?? SILVER_CATEGORIES[0];
  }, [categoryKey]);

  // Lightweight category-specific dynamic filters. Since demo dataset doesn't contain ring size/chain length/etc,
  // these UI values only exist for UX consistency; actual filtering is currently backed by shared fields.
  const categoryBlocks: {
    id: string;
    title: string;
    fields: { key: keyof SilverFiltersState; label: string; options: { value: string; label: string }[] }[];
  }[] = useMemo(() => {
    const commonAvailability = {
      value: "all",
      label: "All",
    };

    const availabilityOptions: { value: string; label: string }[] = [
      commonAvailability,
      { value: "In Stock", label: "In Stock" },
      { value: "Low Stock", label: "Low Stock" },
      { value: "Out of Stock", label: "Out of Stock" },
    ];

    const hallmarkOptions: { value: string; label: string }[] = [
      { value: "all", label: "All" },
      { value: "92.5 Hallmark", label: "92.5 Hallmark" },
      { value: "999 Pure", label: "999 Pure" },
      { value: "Sterling", label: "Sterling" },
    ];

    if (categoryKey === "rings") {
      return [
        {
          id: "essentials",
          title: "Essentials",
          fields: [
            { key: "hallmark", label: "Hallmark", options: hallmarkOptions },
            {
              key: "ringSize",
              label: "Ring Size",
              options: [
                { value: "all", label: "All" },
                { value: "S", label: "Size S" },
                { value: "M", label: "Size M" },
                { value: "L", label: "Size L" },
              ],
            },
            {
              key: "gender",
              label: "Gender",
              options: [
                { value: "all", label: "All" },
                { value: "women", label: "Women" },
                { value: "men", label: "Men" },
                { value: "unisex", label: "Unisex" },
              ],
            },
            {
              key: "designType",
              label: "Design Type",
              options: [
                { value: "all", label: "All" },
                { value: "minimal", label: "Minimal" },
                { value: "temple", label: "Temple" },
                { value: "ornate", label: "Ornate" },
              ],
            },
            {
              key: "weightBand",
              label: "Weight Range",
              options: [
                { value: "all", label: "All" },
                { value: "8-15", label: "8g–15g" },
                { value: "18-25", label: "18g–25g" },
                { value: "28-40", label: "28g–40g" },
              ],
            },
            {
              key: "priceBand",
              label: "Price Range",
              options: [
                { value: "all", label: "All" },
                { value: "<1000", label: "Below 1000" },
                { value: "1000-2500", label: "1000–2500" },
                { value: ">2500", label: "Above 2500" },
              ],
            },
            { key: "availability", label: "Availability", options: availabilityOptions },
          ],
        },
      ];
    }

    if (categoryKey === "anklets") {
      return [
        {
          id: "essentials",
          title: "Essentials",
          fields: [
            { key: "hallmark", label: "Hallmark", options: hallmarkOptions },
            {
              key: "sizeLength",
              label: "Size / Length",
              options: [
                { value: "all", label: "All" },
                { value: "S", label: "Small" },
                { value: "M", label: "Medium" },
                { value: "L", label: "Large" },
              ],
            },
            {
              key: "pattern",
              label: "Pattern",
              options: [
                { value: "all", label: "All" },
                { value: "peacock", label: "Peacock" },
                { value: "temple", label: "Temple" },
                { value: "traditional", label: "Traditional" },
              ],
            },
            {
              key: "weightBand",
              label: "Weight Range",
              options: [
                { value: "all", label: "All" },
                { value: "8-15", label: "8g–15g" },
                { value: "18-25", label: "18g–25g" },
                { value: "28-40", label: "28g–40g" },
              ],
            },
            {
              key: "priceBand",
              label: "Price Range",
              options: [
                { value: "all", label: "All" },
                { value: "<1000", label: "Below 1000" },
                { value: "1000-2500", label: "1000–2500" },
                { value: ">2500", label: "Above 2500" },
              ],
            },
            { key: "availability", label: "Availability", options: availabilityOptions },
          ],
        },
      ];
    }

    // Default for other categories to keep scalable UX pattern
    return [
      {
        id: "essentials",
        title: "Essentials",
        fields: [
          { key: "hallmark", label: "Hallmark", options: hallmarkOptions },
          {
            key: "weightBand",
            label: "Weight Range",
            options: [
              { value: "all", label: "All" },
              { value: "8-15", label: "8g–15g" },
              { value: "18-25", label: "18g–25g" },
              { value: "28-40", label: "28g–40g" },
            ],
          },
          {
            key: "priceBand",
            label: "Price Range",
            options: [
              { value: "all", label: "All" },
              { value: "<1000", label: "Below 1000" },
              { value: "1000-2500", label: "1000–2500" },
              { value: ">2500", label: "Above 2500" },
            ],
          },
          { key: "availability", label: "Availability", options: availabilityOptions },
        ],
      },
    ];
  }, [categoryKey]);

  const hallmarkMappedToPurity = (v: string) => {
    // Demo mapping: keep in sync with existing purity filter by translating hallmark selection.
    if (v === "92.5 Hallmark") return "92.5 Hallmark Silver";
    if (v === "999 Pure") return "999 Pure Silver";
    if (v === "Sterling") return "Sterling Silver 92.5";
    return "all";
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-4 shadow-sm">
      {/* Top header */}
      <div>
        <div className="text-xs font-body font-bold text-slate-700 uppercase tracking-widest">Handpicked for Shine, Purity & Gifting</div>
        <div className="mt-1 text-sm font-body font-bold text-slate-900">Showing {resultsCount} Results</div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-body font-bold text-slate-900">Instant Silver Search</p>
            <p className="text-xs font-body text-slate-600">Try: Kolusu, Metti, Chain, Ring, Gift</p>
          </div>
        </div>

        <div className="mt-3">
          <input
            value={state.query}
            onChange={(e) => setState({ ...state, query: e.target.value })}
            placeholder="Search Silver Jewelry..."
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {/* Level 1: Categories */}
      <div className="mt-4">
        <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Silver Categories</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {SILVER_CATEGORIES.map((c) => (
            <SegmentedCategoryButton
              key={c.key}
              emoji={c.emoji}
              title={c.title}
              subtitle={c.subtitle}
              active={state.categoryKey === c.key}
              onClick={() => {
                onPickCategory(c.key);
                setOpenBlock("essentials");
              }}
            />
          ))}
        </div>
      </div>

      {/* Level 2: Dynamic filters */}
      <div className="mt-4">
        <AccordionSection
          title={`${category.title} Filters`}
          open={openBlock === "essentials"}
          onToggle={() => setOpenBlock((v) => (v === "essentials" ? "" : "essentials"))}
        >
          {/* Always-present mapped filters (existing backend fields) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white border border-slate-200 p-3">
              <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Min Price</p>
              <input
                type="number"
                value={state.minPrice}
                onChange={(e) => setState({ ...state, minPrice: Number(e.target.value || 0) })}
                className="mt-2 w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-3">
              <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Max Price</p>
              <input
                type="number"
                value={state.maxPrice}
                onChange={(e) => setState({ ...state, maxPrice: Number(e.target.value || 0) })}
                className="mt-2 w-full text-sm font-body border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white border border-slate-200 p-3">
            <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Purity</p>
            <select
              value={state.purity}
              onChange={(e) => setState({ ...state, purity: e.target.value })}
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            >
              <option value="all">All Purities</option>
              {purityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <p className="text-[11px] text-slate-600 font-body font-bold uppercase">Weight Range (g)</p>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                value={state.weightMin}
                onChange={(e) => setState({ ...state, weightMin: Number(e.target.value || 0) })}
                className="w-1/2 text-sm font-body border border-slate-200 rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                type="number"
                value={state.weightMax}
                onChange={(e) => setState({ ...state, weightMax: Number(e.target.value || 0) })}
                className="w-1/2 text-sm font-body border border-slate-200 rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-body">
              Available: {allWeights.min}g–{allWeights.max}g
            </p>
          </div>

          {/* Category-specific UI fields (with minimal mapping for Hallmark/Availability to existing fields) */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryBlocks[0].fields.map((f) => {
              if (f.key === "availability") {
                return (
                  <SelectPill
                    key={f.key}
                    label={f.label}
                    value={state.availability}
                    onChange={(next) => setState({ ...state, availability: next as SilverFiltersState["availability"] })}
                    options={f.options}
                  />
                );
              }
              if (f.key === "hallmark") {
                return (
                  <SelectPill
                    key={f.key}
                    label={f.label}
                    value={state.hallmark}
                    onChange={(next) =>
                      setState({
                        ...state,
                        hallmark: next,
                        // map to existing purity filter for real filtering
                        purity: hallmarkMappedToPurity(next),
                      })
                    }
                    options={f.options}
                  />
                );
              }
              return (
                <SelectPill
                  key={f.key}
                  label={f.label}
                  value={String(state[f.key])}
                  onChange={(next) => setState({ ...state, [f.key]: next } as SilverFiltersState)}
                  options={f.options}
                />
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 text-[11px] text-slate-500 font-body">Filters update instantly.</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-body font-bold text-slate-700">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
        </AccordionSection>
      </div>

      {/* Hidden helper to avoid unused imports warnings in some TS configs */}
      <div className="hidden" aria-hidden>
        {openBlock}
      </div>
    </div>
  );
}

