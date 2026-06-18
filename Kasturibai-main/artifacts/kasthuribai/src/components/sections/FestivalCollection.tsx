import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product, Color, Subcategory, Style } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { FilterPanel, FilterState } from "./FilterPanel";

interface FestivalCollectionProps {
  onViewProduct?: (product: Product) => void;
}

const FESTIVAL_SUBCATEGORIES: Subcategory[] = ["Sarees", "Lehengas", "Gowns", "Sherwanis", "Dhotis", "Kurta Pajama"];
const FESTIVAL_COLORS: Color[] = ["Red", "Gold", "Maroon", "Green", "Blue", "Pink", "Purple"];
const FESTIVAL_SIZES: string[] = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const FESTIVAL_STYLES: Style[] = ["Festive", "Wedding", "Traditional", "Party Wear"];

export function FestivalCollection({ onViewProduct }: FestivalCollectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    colors: [],
    sizes: [],
    subcategories: [],
    ageRanges: [],
    styles: [],
    sortBy: "Default",
  });

  const [activeTab, setActiveTab] = useState<"all" | "diwali" | "pongal" | "wedding" | "premium">("all");

  const festivalProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === "Festive" || p.category === "Traditional");
  }, []);

  const filteredProducts = useMemo(() => {
    let result = festivalProducts;

    // Filter by tab
    if (activeTab === "diwali") {
      result = result.filter((p) => p.styles?.includes("Festive"));
    } else if (activeTab === "pongal") {
      result = result.filter((p) => p.styles?.includes("Traditional"));
    } else if (activeTab === "wedding") {
      result = result.filter((p) => p.styles?.includes("Wedding"));
    } else if (activeTab === "premium") {
      result = result.filter((p) => p.badges?.includes("Premium"));
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
  }, [festivalProducts, filters, activeTab]);

  const tabs = [
    { id: "all", label: "All", icon: "🎉" },
    { id: "diwali", label: "Diwali", icon: "🪔" },
    { id: "pongal", label: "Pongal", icon: "🌾" },
    { id: "wedding", label: "Wedding", icon: "💍" },
    { id: "premium", label: "Premium", icon: "✨" },
  ];

  return (
    <section id="festival" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-primary font-body font-semibold text-xs sm:text-sm uppercase tracking-wider">
            🎊 Festival Collection
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-1 mb-2 sm:mb-3">
            Festival & Traditional Wear
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold rounded-full mx-auto"></div>
          <p className="text-sm sm:text-base text-muted-foreground font-body mt-4 max-w-2xl mx-auto">
            Celebrate Every Festival in Style
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-250 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex gap-6 lg:gap-8">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            availableSubcategories={FESTIVAL_SUBCATEGORIES}
            availableColors={FESTIVAL_COLORS}
            availableSizes={FESTIVAL_SIZES}
            availableStyles={FESTIVAL_STYLES}
            showAgeFilter={false}
            className="w-64 flex-shrink-0"
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground font-body">
                {filteredProducts.length} products
              </span>
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            >
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
    </section>
  );
}
