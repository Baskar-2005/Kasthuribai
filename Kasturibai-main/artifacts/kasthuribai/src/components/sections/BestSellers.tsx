import { PRODUCTS, Product } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { Trophy } from "lucide-react";

interface BestSellersProps {
  onViewProduct?: (product: Product) => void;
}

export function BestSellers({ onViewProduct }: BestSellersProps) {
  const bestSellers = PRODUCTS.filter((p) => p.badges?.some((b) => ["Best Seller", "Premium", "Hot"].includes(b)));
  const fallback = PRODUCTS.slice(6, 10);
  const display = bestSellers.length >= 4 ? bestSellers.slice(0, 4) : [...bestSellers, ...fallback].slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">Customer Favorites</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Best Sellers</h2>
            <div className="w-20 h-1 bg-gold rounded-full"></div>
          </div>
          <button
            onClick={() => document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-body font-semibold text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {display.map((product, i) => (
            <div key={product.id} className="relative">
              <div className="absolute -top-3 -left-2 z-10 w-8 h-8 bg-gold text-black text-xs font-body font-bold flex items-center justify-center rounded-full shadow-md">
                #{i + 1}
              </div>
              <ProductCard product={product} onView={onViewProduct} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
