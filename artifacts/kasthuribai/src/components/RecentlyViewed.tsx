import { useRef } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, Product } from "@/data/mock-data";
import { ProductCard } from "./sections/ProductCard";

interface RecentlyViewedProps {
  recentIds: string[];
  onViewProduct?: (p: Product) => void;
}

export function RecentlyViewed({ recentIds, onViewProduct }: RecentlyViewedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = recentIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => !!p)
    .slice(0, 8);

  if (products.length < 2) return null;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-14 bg-amber-50/40 border-y border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Recently Viewed</h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">Continue browsing where you left off</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-amber-400 hover:shadow-sm transition-all text-gray-500 hover:text-amber-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-amber-400 hover:shadow-sm transition-all text-gray-500 hover:text-amber-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div className="relative">
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-50/40 to-transparent z-10" />
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex-none w-[168px] sm:w-[185px] snap-start"
              >
                <ProductCard product={product} onView={onViewProduct} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
