import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Color, AgeRange, Style, Subcategory } from "@/data/mock-data";

export interface FilterState {
  priceRange: [number, number];
  colors: Color[];
  sizes: string[];
  subcategories: Subcategory[];
  ageRanges: AgeRange[];
  styles: Style[];
  sortBy: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableColors?: Color[];
  availableSizes?: string[];
  availableSubcategories?: Subcategory[];
  availableAgeRanges?: AgeRange[];
  availableStyles?: Style[];
  showPriceFilter?: boolean;
  showColorFilter?: boolean;
  showSizeFilter?: boolean;
  showSubcategoryFilter?: boolean;
  showAgeFilter?: boolean;
  showStyleFilter?: boolean;
  className?: string;
}

const COLOR_MAP: Record<Color, string> = {
  Red: "bg-red-500",
  Blue: "bg-blue-500",
  Green: "bg-green-500",
  Yellow: "bg-yellow-400",
  Black: "bg-gray-900",
  White: "bg-white border-2 border-gray-300",
  Pink: "bg-pink-500",
  Purple: "bg-purple-500",
  Orange: "bg-orange-500",
  Gold: "bg-amber-500",
  Silver: "bg-gray-400",
  Maroon: "bg-red-800",
  Navy: "bg-blue-900",
  Cream: "bg-amber-100",
  Brown: "bg-amber-800",

  // ✅ Newly added colors
  Grey: "bg-gray-500",
  Beige: "bg-amber-200",
  Olive: "bg-lime-700",
  Khaki: "bg-yellow-600",
};

const SORT_OPTIONS = [
  "Default",
  "Price: Low to High",
  "Price: High to Low",
  "Rating: High to Low",
  "Most Reviewed",
  "Newest First",
];

export function FilterPanel({
  filters,
  onFilterChange,
  availableColors = [],
  availableSizes = [],
  availableSubcategories = [],
  availableAgeRanges = [],
  availableStyles = [],
  showPriceFilter = true,
  showColorFilter = true,
  showSizeFilter = true,
  showSubcategoryFilter = true,
  showAgeFilter = false,
  showStyleFilter = true,
  className,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    color: true,
    size: true,
    subcategory: true,
    age: true,
    style: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleColorToggle = (color: Color) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleSubcategoryToggle = (sub: Subcategory) => {
    const newSubs = filters.subcategories.includes(sub)
      ? filters.subcategories.filter((s) => s !== sub)
      : [...filters.subcategories, sub];
    onFilterChange({ ...filters, subcategories: newSubs });
  };

  const handleAgeToggle = (age: AgeRange) => {
    const newAges = filters.ageRanges.includes(age)
      ? filters.ageRanges.filter((a) => a !== age)
      : [...filters.ageRanges, age];
    onFilterChange({ ...filters, ageRanges: newAges });
  };

  const handleStyleToggle = (style: Style) => {
    const newStyles = filters.styles.includes(style)
      ? filters.styles.filter((s) => s !== style)
      : [...filters.styles, style];
    onFilterChange({ ...filters, styles: newStyles });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [0, 5000],
      colors: [],
      sizes: [],
      subcategories: [],
      ageRanges: [],
      styles: [],
      sortBy: "Default",
    });
  };

  const activeFilterCount =
    filters.colors.length +
    filters.sizes.length +
    filters.subcategories.length +
    filters.ageRanges.length +
    filters.styles.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0);

  return (
    <div 
      className={cn(
        "space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto filter-scrollbar",
        className
      )}
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Clear Filter Button at Top */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 text-sm font-body font-semibold text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors py-2 px-3 rounded-lg border border-primary/20"
        >
          <X className="w-4 h-4" />
          Clear All Filters ({activeFilterCount})
        </button>
      )}

      {/* Sort By */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("sort")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-body font-semibold text-foreground">Sort By</span>
          {expandedSections.sort ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.sort && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
                className="w-full mt-2 text-sm font-body border border-border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Filter */}
      {showPriceFilter && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">💰 Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                      className="w-full text-sm font-body border border-border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/30 outline-none"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                      className="w-full text-sm font-body border border-border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/30 outline-none"
                      placeholder="Max"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: "Under ₹500", min: 0, max: 500 },
                      { label: "₹500-₹1000", min: 500, max: 1000 },
                      { label: "₹1000-₹2000", min: 1000, max: 2000 },
                      { label: "₹2000+", min: 2000, max: 5000 },
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          onFilterChange({
                            ...filters,
                            priceRange: [range.min, range.max],
                          })
                        }
                        className={cn(
                          "text-xs font-body px-2 py-1 rounded-full border transition-colors",
                          filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-foreground border-border hover:border-primary"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Subcategory Filter */}
      {showSubcategoryFilter && availableSubcategories.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("subcategory")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">👔 Categories</span>
            {expandedSections.subcategory ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.subcategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableSubcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubcategoryToggle(sub)}
                      className={cn(
                        "text-xs font-body px-3 py-1.5 rounded-full border transition-colors",
                        filters.subcategories.includes(sub)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Color Filter */}
      {showColorFilter && availableColors.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("color")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">🎨 Colors</span>
            {expandedSections.color ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.color && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        COLOR_MAP[color],
                        filters.colors.includes(color)
                          ? "border-primary ring-2 ring-primary/30 scale-110"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                      title={color}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Size Filter */}
      {showSizeFilter && availableSizes.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("size")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">📏 Sizes</span>
            {expandedSections.size ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.size && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={cn(
                        "text-xs font-body px-3 py-1.5 rounded-full border transition-colors",
                        filters.sizes.includes(size)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Age Filter (for Kids) */}
      {showAgeFilter && availableAgeRanges.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("age")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">👶 Age Range</span>
            {expandedSections.age ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.age && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableAgeRanges.map((age) => (
                    <button
                      key={age}
                      onClick={() => handleAgeToggle(age)}
                      className={cn(
                        "text-xs font-body px-3 py-1.5 rounded-full border transition-colors",
                        filters.ageRanges.includes(age)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary"
                      )}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Style Filter */}
      {showStyleFilter && availableStyles.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("style")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-body font-semibold text-foreground">🎯 Style</span>
            {expandedSections.style ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.style && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => handleStyleToggle(style)}
                      className={cn(
                        "text-xs font-body px-3 py-1.5 rounded-full border transition-colors",
                        filters.styles.includes(style)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
