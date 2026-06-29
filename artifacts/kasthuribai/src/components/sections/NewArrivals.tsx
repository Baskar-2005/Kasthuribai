import { useRef } from "react";
import { PRODUCTS, Product } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface NewArrivalsProps {
  onViewProduct?: (product: Product) => void;
}

export function NewArrivals({ onViewProduct }: NewArrivalsProps) {
  const newProducts = PRODUCTS.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section id="new-arrivals" className="py-14 sm:py-20 bg-gradient-to-b from-gray-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              New Arrivals
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 leading-tight">
              Fresh Collections
            </h2>
            <p className="text-gray-500 font-body text-sm mt-1.5">
              Hand-picked new arrivals just for you
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-md transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-md transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50/80 to-transparent z-10 hidden sm:block" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 hidden sm:block" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {newProducts.map((product) => (
              <div key={product.id} className="flex-none w-[200px] sm:w-[220px] snap-start">
                <ProductCard product={product} onView={onViewProduct} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view-all */}
        <div className="mt-6 flex justify-center md:hidden">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all">
            View All New Arrivals <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
