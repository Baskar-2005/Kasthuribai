import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Category, Product, Color, Subcategory, Style, AgeRange } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsProps {
  onViewProduct?: (product: Product) => void;
  activeFilter?: Category | "All";
  onFilterChange?: (f: Category | "All") => void;
}

const COLOR_MAP: Record<string, string> = {
  Red: "bg-red-500", Blue: "bg-blue-500", Green: "bg-green-500", Yellow: "bg-yellow-400",
  Black: "bg-gray-900", White: "bg-white border border-gray-300", Pink: "bg-pink-500",
  Purple: "bg-purple-500", Orange: "bg-orange-500", Gold: "bg-amber-500", Silver: "bg-gray-400",
  Maroon: "bg-red-800", Navy: "bg-blue-900", Cream: "bg-amber-100", Brown: "bg-amber-800",
  Grey: "bg-gray-500", Beige: "bg-amber-200", Olive: "bg-lime-700", Khaki: "bg-yellow-600",
};

const CAT_META: Record<string, { icon: string; label: string; color: string }> = {
  All:         { icon: "🛍️", label: "All Products", color: "from-gray-700 to-gray-900" },
  Men:         { icon: "👔", label: "Men's Wear",   color: "from-slate-700 to-blue-900" },
  Women:       { icon: "👗", label: "Women's Wear", color: "from-rose-700 to-pink-900"  },
  Kids:        { icon: "🧸", label: "Kids' Wear",   color: "from-emerald-700 to-teal-900" },
  Traditional: { icon: "🪷", label: "Traditional",  color: "from-amber-700 to-orange-900" },
  Festive:     { icon: "🎊", label: "Festive Wear", color: "from-amber-600 to-yellow-800" },
};

const CAT_FILTERS: Record<string, { subcategories: Subcategory[]; styles: Style[]; sizes: string[]; ageRanges: AgeRange[] }> = {
  All:         { subcategories: ["Shirts","T-Shirts","Jeans","Formal Wear","Sarees","Kurtis","Chudidhar","Gowns","Lehengas","Dresses","Frocks","Kurta Pajama","Sherwanis","Dhotis"], styles: ["Office Wear","Casual Wear","Party Wear","Daily Wear","Traditional","Festive","Wedding"], sizes: ["XS","S","M","L","XL","XXL","Free Size","2-3Y","4-5Y","6-7Y"], ageRanges: [] },
  Men:         { subcategories: ["Shirts","T-Shirts","Jeans","Formal Wear"], styles: ["Office Wear","Casual Wear","Party Wear","Traditional"], sizes: ["S","M","L","XL","XXL","28","30","32","34","36"], ageRanges: [] },
  Women:       { subcategories: ["Sarees","Kurtis","Chudidhar","Gowns","Lehengas"], styles: ["Daily Wear","Casual Wear","Party Wear","Festive","Wedding"], sizes: ["XS","S","M","L","XL","XXL","Free Size"], ageRanges: [] },
  Kids:        { subcategories: ["T-Shirts","Dresses","Frocks","Kurta Pajama","Formal Wear"], styles: ["Casual Wear","Party Wear","Daily Wear","Festive"], sizes: ["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y","12Y"], ageRanges: ["1-3 yrs","4-8 yrs","9-12 yrs"] },
  Traditional: { subcategories: ["Sarees","Kurta Pajama","Dhotis","Sherwanis"], styles: ["Traditional","Festive","Wedding"], sizes: ["S","M","L","XL","XXL","Free Size"], ageRanges: [] },
  Festive:     { subcategories: ["Sarees","Lehengas","Gowns","Sherwanis","Dhotis","Kurta Pajama"], styles: ["Festive","Wedding","Party Wear","Traditional"], sizes: ["XS","S","M","L","XL","XXL","Free Size"], ageRanges: [] },
};

const ALL_COLORS: Color[] = ["Red","Blue","Green","Yellow","Black","White","Pink","Purple","Orange","Gold","Silver","Maroon","Navy","Cream","Brown","Grey","Beige","Olive","Khaki"];
const SORT_OPTIONS = ["Default","Price: Low to High","Price: High to Low","Rating: High to Low","Most Reviewed","Newest First"];
const PRICE_QUICK = [
  { label: "Under ₹500",   min: 0,    max: 500   },
  { label: "₹500–₹1,000",  min: 500,  max: 1000  },
  { label: "₹1,000–₹2,000",min: 1000, max: 2000  },
  { label: "₹2,000–₹5,000",min: 2000, max: 5000  },
];
const CATEGORY_LIST: (Category | "All")[] = ["All","Men","Women","Kids","Traditional","Festive"];

interface FilterState {
  priceRange: [number, number];
  colors: Color[];
  sizes: string[];
  subcategories: Subcategory[];
  ageRanges: AgeRange[];
  styles: Style[];
  sortBy: string;
}

const DEFAULT_FILTERS: FilterState = { priceRange: [0, 5000], colors: [], sizes: [], subcategories: [], ageRanges: [], styles: [], sortBy: "Default" };

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full text-left py-1 group">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-700 transition-colors">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
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

export function Products({ onViewProduct, activeFilter: externalFilter, onFilterChange }: ProductsProps) {
  const [internalFilter, setInternalFilter] = useState<Category | "All">("All");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const tabRef = useRef<HTMLDivElement>(null);

  const activeFilter = externalFilter ?? internalFilter;
  const setActiveFilter = (f: Category | "All") => {
    (onFilterChange ?? setInternalFilter)(f);
    // Clear subcategories/styles that might not apply to new category
    setFilters(prev => ({ ...prev, subcategories: [], styles: [], sizes: [], ageRanges: [] }));
  };

  const catMeta = CAT_META[activeFilter] ?? CAT_META.All;
  const catFilters = CAT_FILTERS[activeFilter] ?? CAT_FILTERS.All;

  // Wheel-to-scroll on category tab row
  useEffect(() => {
    const el = tabRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => { if (e.deltaY === 0) return; e.preventDefault(); el.scrollBy({ left: e.deltaY * 1.5, behavior: "smooth" }); };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const filteredProducts = useMemo(() => {
    let r = PRODUCTS;
    if (activeFilter !== "All") r = r.filter(p => p.category === activeFilter);
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(q) || p.subcategory?.toLowerCase().includes(q)); }
    if (filters.subcategories.length) r = r.filter(p => p.subcategory && filters.subcategories.includes(p.subcategory));
    if (filters.colors.length) r = r.filter(p => p.colors?.some(c => filters.colors.includes(c)));
    if (filters.sizes.length) r = r.filter(p => p.sizes?.some(s => filters.sizes.includes(s)));
    if (filters.styles.length) r = r.filter(p => p.styles?.some(s => filters.styles.includes(s)));
    if (filters.ageRanges.length) r = r.filter(p => p.ageRange && filters.ageRanges.includes(p.ageRange));
    r = r.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    if (filters.sortBy === "Price: Low to High")  r = [...r].sort((a, b) => a.price - b.price);
    if (filters.sortBy === "Price: High to Low")  r = [...r].sort((a, b) => b.price - a.price);
    if (filters.sortBy === "Rating: High to Low") r = [...r].sort((a, b) => b.rating - a.rating);
    if (filters.sortBy === "Most Reviewed")        r = [...r].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    if (filters.sortBy === "Newest First")          r = [...r].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    return r;
  }, [activeFilter, filters, searchQuery]);

  const activeChipCount = filters.colors.length + filters.sizes.length + filters.subcategories.length + filters.styles.length + filters.ageRanges.length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0) + (filters.sortBy !== "Default" ? 1 : 0);

  const toggle = <T extends string>(arr: T[], val: T) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  // Sidebar filter panel
  const FilterContent = (
    <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sticky top-0 bg-white pb-3 border-b border-gray-100">
        <div>
          <p className="font-bold text-gray-800 text-sm">Filters</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{filteredProducts.length} results</p>
        </div>
        {activeChipCount > 0 && (
          <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort by">
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setFilters(f => ({ ...f, sortBy: opt }))}
              className={cn("flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all", filters.sortBy === opt ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100")}
            >
              {opt}
              {filters.sortBy === opt && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-2 mb-3">
          {PRICE_QUICK.map(p => {
            const active = filters.priceRange[0] === p.min && filters.priceRange[1] === p.max;
            return (
              <button key={p.label} onClick={() => setFilters(f => ({ ...f, priceRange: [p.min, p.max] }))}
                className={cn("flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all", active ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100")}
              >
                {p.label} {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block mb-1">Min ₹</label>
            <input type="number" value={filters.priceRange[0]} onChange={e => setFilters(f => ({ ...f, priceRange: [Number(e.target.value), f.priceRange[1]] }))}
              className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-gray-200 bg-white" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block mb-1">Max ₹</label>
            <input type="number" value={filters.priceRange[1]} onChange={e => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
              className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-gray-200 bg-white" />
          </div>
        </div>
      </FilterSection>

      {/* Dynamic Subcategories */}
      <AnimatePresence mode="wait">
        <motion.div key={activeFilter + "-sub"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {catFilters.subcategories.length > 0 && (
            <FilterSection title="Category">
              <div className="flex flex-wrap gap-1.5">
                {catFilters.subcategories.map(sub => (
                  <button key={sub} onClick={() => setFilters(f => ({ ...f, subcategories: toggle(f.subcategories, sub) }))}
                    className={cn("text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all", filters.subcategories.includes(sub) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}
                  >{sub}</button>
                ))}
              </div>
            </FilterSection>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Colors */}
      <FilterSection title="Colors">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map(color => (
            <button key={color} title={color} onClick={() => setFilters(f => ({ ...f, colors: toggle(f.colors, color) }))}
              className={cn("w-7 h-7 rounded-full transition-all border-2", COLOR_MAP[color], filters.colors.includes(color) ? "ring-2 ring-offset-1 ring-gray-700 border-white scale-110" : "border-transparent hover:scale-105")}
            />
          ))}
        </div>
      </FilterSection>

      {/* Dynamic Sizes */}
      <AnimatePresence mode="wait">
        <motion.div key={activeFilter + "-size"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {catFilters.sizes.length > 0 && (
            <FilterSection title="Sizes">
              <div className="flex flex-wrap gap-1.5">
                {catFilters.sizes.map(size => (
                  <button key={size} onClick={() => setFilters(f => ({ ...f, sizes: toggle(f.sizes, size) }))}
                    className={cn("min-w-[36px] text-center text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all", filters.sizes.includes(size) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}
                  >{size}</button>
                ))}
              </div>
            </FilterSection>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Age Ranges (Kids) */}
      <AnimatePresence mode="wait">
        {catFilters.ageRanges.length > 0 && (
          <motion.div key={activeFilter + "-age"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <FilterSection title="Age Range">
              <div className="flex flex-wrap gap-1.5">
                {catFilters.ageRanges.map(age => (
                  <button key={age} onClick={() => setFilters(f => ({ ...f, ageRanges: toggle(f.ageRanges, age) }))}
                    className={cn("text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all", filters.ageRanges.includes(age) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}
                  >{age}</button>
                ))}
              </div>
            </FilterSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Styles */}
      <AnimatePresence mode="wait">
        <motion.div key={activeFilter + "-style"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {catFilters.styles.length > 0 && (
            <FilterSection title="Style / Occasion">
              <div className="flex flex-wrap gap-1.5">
                {catFilters.styles.map(style => (
                  <button key={style} onClick={() => setFilters(f => ({ ...f, styles: toggle(f.styles, style) }))}
                    className={cn("text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all", filters.styles.includes(style) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}
                  >{style}</button>
                ))}
              </div>
            </FilterSection>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50/50">
      {/* ── Warm banner header ── */}
      <div className={cn("bg-gradient-to-br py-10 sm:py-14 relative overflow-hidden", catMeta.color)}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">Kasthuribai · NMP Readymades</p>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{catMeta.icon}</span>
                {catMeta.label}
              </h1>
              <p className="text-white/50 font-body text-sm mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
              </p>
            </div>
            {/* Search bar */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 backdrop-blur-sm min-w-[220px]">
              <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder:text-white/40 text-sm font-body outline-none flex-1 min-w-0"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-white/50" /></button>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky category tabs ── */}
      <div className="sticky top-[62px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative py-3">
            {/* Fades */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/95 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/95 to-transparent z-10" />
            <div ref={tabRef} className="flex items-center gap-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none" style={{ scrollbarWidth: "none" }}>
              {CATEGORY_LIST.map(cat => {
                const meta = CAT_META[cat] ?? CAT_META.All;
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      "relative shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap overflow-hidden border",
                      isActive
                        ? "border-transparent text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cat-tab-bg"
                        className={cn("absolute inset-0 bg-gradient-to-r rounded-full", catMeta.color)}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{meta.icon}</span>
                    <span className="relative z-10">{cat}</span>
                    {isActive && <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile search + filter button */}
        <div className="sm:hidden flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-sm font-body outline-none flex-1 min-w-0 text-gray-700 placeholder:text-gray-400" />
          </div>
          <button onClick={() => setMobileOpen(true)} className={cn("flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all", activeChipCount > 0 ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700")}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters{activeChipCount > 0 ? ` (${activeChipCount})` : ""}
          </button>
        </div>

        {/* Active filter chips */}
        {activeChipCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {filters.subcategories.map(s => <Chip key={s} label={s} onRemove={() => setFilters(f => ({ ...f, subcategories: f.subcategories.filter(x => x !== s) }))} />)}
            {filters.styles.map(s => <Chip key={s} label={s} onRemove={() => setFilters(f => ({ ...f, styles: f.styles.filter(x => x !== s) }))} />)}
            {filters.sizes.map(s => <Chip key={s} label={s} onRemove={() => setFilters(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }))} />)}
            {filters.ageRanges.map(a => <Chip key={a} label={a} onRemove={() => setFilters(f => ({ ...f, ageRanges: f.ageRanges.filter(x => x !== a) }))} />)}
            {filters.colors.map(c => <Chip key={c} label={c} onRemove={() => setFilters(f => ({ ...f, colors: f.colors.filter(x => x !== c) }))} />)}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && <Chip label={`₹${filters.priceRange[0]}–₹${filters.priceRange[1]}`} onRemove={() => setFilters(f => ({ ...f, priceRange: [0, 5000] }))} />}
            {filters.sortBy !== "Default" && <Chip label={filters.sortBy} onRemove={() => setFilters(f => ({ ...f, sortBy: "Default" }))} />}
          </div>
        )}

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-[130px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {FilterContent}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 font-body">
                <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")} className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors hidden sm:flex">
                  {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </button>
                <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                  className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl pl-3 pr-7 py-2 outline-none cursor-pointer hover:border-gray-400 appearance-none"
                >
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-24">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="font-body text-gray-500 text-lg mb-2">No products found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                  <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">Clear all filters</button>
                </motion.div>
              ) : (
                <motion.div
                  key={activeFilter + filters.sortBy}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                      : "flex flex-col gap-3"
                  )}
                >
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onView={onViewProduct} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 35 }} className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white z-[101] shadow-2xl rounded-l-3xl overflow-hidden">
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-gray-800">Filters</p>
                  <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">{FilterContent}</div>
                <button onClick={() => setMobileOpen(false)} className="mt-4 w-full bg-gray-900 text-white py-3.5 rounded-2xl font-semibold text-sm">
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
