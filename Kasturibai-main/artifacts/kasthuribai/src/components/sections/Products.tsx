import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Category, Product, Color, Subcategory, Style } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { FilterPanel, FilterState } from "./FilterPanel";
import { MobileFilterDrawer } from "../MobileFilterDrawer";
import { SlidersHorizontal } from "lucide-react";

interface ProductsProps {
  onViewProduct?: (product: Product) => void;
  activeFilter?: Category | "All";
  onFilterChange?: (f: Category | "All") => void;
}

const ALL_SUBCATEGORIES: Subcategory[] = ["Shirts", "T-Shirts", "Jeans", "Formal Wear", "Sarees", "Kurtis", "Chudidhar", "Gowns", "Lehengas", "Dresses", "Frocks", "Kurta Pajama", "Sherwanis", "Dhotis"];
const ALL_COLORS: Color[] = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Pink", "Purple", "Orange", "Gold", "Silver", "Maroon", "Navy", "Cream", "Brown"];
const ALL_SIZES: string[] = ["XS", "S", "M", "L", "XL", "XXL", "Free Size", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12Y", "28", "30", "32", "34", "36"];
const ALL_STYLES: Style[] = ["Office Wear", "Casual Wear", "Party Wear", "Daily Wear", "Traditional", "Festive", "Wedding"];

export function Products({ onViewProduct, activeFilter: externalFilter, onFilterChange }: ProductsProps) {
  const [internalFilter, setInternalFilter] = useState<Category | "All">("All");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    colors: [],
    sizes: [],
    subcategories: [],
    ageRanges: [],
    styles: [],
    sortBy: "Default",
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilter = externalFilter ?? internalFilter;
  const setActiveFilter = onFilterChange ?? setInternalFilter;

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Category filter
    if (activeFilter !== "All") {
      result = result.filter((p) => p.category === activeFilter);
    }

    // Apply filters
    if (filters.subcategories.length > 0) {
      result = result.filter((p) => p.subcategory && filters.subcategories.includes(p.subcategory));
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) => p.colors?.some((c) => filters.colors.includes(c)));
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((s) => filters.sizes.includes(s)));
    }

    if (filters.styles.length > 0) {
      result = result.filter((p) => p.styles?.some((s) => filters.styles.includes(s)));
    }

    // Price filter
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Sort
    if (filters.sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "Rating: High to Low") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "Most Reviewed") {
      result = [...result].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    } else if (filters.sortBy === "Newest First") {
      result = [...result].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [activeFilter, filters]);

  const FILTERS: (Category | "All")[] = ["All", "Men", "Women", "Kids", "Traditional", "Festive"];

  const FILTER_ICONS: Record<string, string> = {
    All: "🛍️ All", Men: "👔 Men", Women: "👗 Women", Kids: "🧸 Kids", Traditional: "🪷 Traditional", Festive: "🎉 Festive"
  };

  return (
    <section id="collections" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6"> */}
          <div>
            <span className="text-primary font-body font-semibold text-xs sm:text-sm uppercase tracking-wider">Explore</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-1 mb-2 sm:mb-3">Our Collections</h2>
            <div className="w-16 sm:w-20 h-1 bg-gold rounded-full"></div>
          {/* </div> */}
        </div>

        {/* Sticky Top Category Filters */}
        {/* Sticky Top Category Filters with Mobile Filter Button */}
        <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-lg pt-4 pb-3 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 sm:mb-8 rounded-b-2xl">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start items-center">
            {/* Mobile Filter Button */}
            <motion.button
              className="sm:hidden flex items-center gap-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-xl text-sm font-semibold hover:border-primary hover:shadow-md transition-all"
              onClick={() => setMobileFilterOpen(true)}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </motion.button>
            {/* Category Buttons - Hide some on mobile */}
            {FILTERS.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-primary to-gold text-white shadow-lg ring-2 ring-gold/50"
                    : "bg-white/80 border border-gray-200 hover:border-primary hover:shadow-md hover:text-primary text-foreground"
                }`}
              >
                <span className="text-sm">{FILTER_ICONS[filter]}</span>
                <span className="hidden xs:inline">{filter}</span>
              </motion.button>
            ))}
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-medium bg-white/60 px-3 py-1.5 rounded-xl backdrop-blur">
              {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 lg:gap-8">
          {/* Sticky Left Filter Panel - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0 mr-12">
            <div className="sticky top-[145px] bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-100 p-5 shadow-sm">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                availableSubcategories={ALL_SUBCATEGORIES}
                availableColors={ALL_COLORS}
                availableSizes={ALL_SIZES}
                availableStyles={ALL_STYLES}
                showAgeFilter={false}
              />
            </div>
          </div>

          {/* No separate mobile filter panel - button in top bar only */}
        

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} onView={onViewProduct} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 sm:py-20 text-muted-foreground font-body">
                <span className="text-3xl sm:text-4xl block mb-2 sm:mb-3">🔍</span>
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <MobileFilterDrawer
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            filters={filters}
            onFilterChange={setFilters}
            availableSubcategories={ALL_SUBCATEGORIES}
            availableColors={ALL_COLORS}
            availableSizes={ALL_SIZES}
            availableStyles={ALL_STYLES}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
