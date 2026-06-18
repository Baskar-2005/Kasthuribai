import { useState, useRef } from "react";
import { PRODUCTS, Product } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface NewArrivalsProps {
  onViewProduct?: (product: Product) => void;
}

export function NewArrivals({ onViewProduct }: NewArrivalsProps) {
  const newProducts = PRODUCTS.slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="new-arrivals" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-body font-bold px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 uppercase">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> New Arrivals
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">Fresh Collections</h2>
            <div className="w-16 sm:w-20 h-1 bg-gold rounded-full"></div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Grid layout for mobile, horizontal scroll for tablet, grid for desktop */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 sm:flex sm:gap-5 sm:overflow-x-auto sm:pb-4 sm:scrollbar-hide sm:snap-x sm:snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible gap-3 sm:gap-0"
          style={{ scrollbarWidth: "none" }}
        >
          {newProducts.map((product, idx) => (
            <div key={product.id} className="sm:min-w-[260px] md:min-w-0 flex-shrink-0 sm:snap-start relative">
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-blue-600 text-white text-[9px] sm:text-xs font-body font-bold px-2 sm:px-2.5 py-0.5 rounded-full">NEW</div>
              <ProductCard product={product} onView={onViewProduct} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
