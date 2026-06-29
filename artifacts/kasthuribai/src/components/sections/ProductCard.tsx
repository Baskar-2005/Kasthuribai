import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/mock-data";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  compact?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Trending":    "bg-violet-500 text-white",
  "Sale":        "bg-rose-500 text-white",
  "Premium":     "bg-gray-800 text-white",
  "Hot":         "bg-orange-500 text-white",
  "New Arrival": "bg-blue-500 text-white",
};

export function ProductCard({ product, onView, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Show at most 2 badges, prioritised
  const PRIORITY = ["New Arrival", "Premium", "Trending", "Best Seller", "Hot", "Sale"];
  const topBadges = (product.badges ?? [])
    .slice()
    .sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b))
    .slice(0, 2);

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-350 cursor-pointer flex flex-col"
      onClick={() => onView?.(product)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-gray-50 ${compact ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-left badges — stacked, no overlap */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {topBadges.map((badge) => (
            <span
              key={badge}
              className={`text-[8px] font-body font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${BADGE_STYLES[badge] ?? "bg-primary text-white"}`}
            >
              {badge === "New Arrival" ? "NEW" : badge === "Best Seller" ? "BEST" : badge.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Discount badge — bottom right */}
        {discount > 0 && (
          <div className={`absolute bottom-2 right-2 ${compact ? "w-8 h-8 text-[9px]" : "w-9 h-9 text-[10px]"} bg-green-500 text-white font-body font-bold rounded-full flex items-center justify-center shadow-md`}>
            -{discount}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => { e.stopPropagation(); onView?.(product); }}
              className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={`${compact ? "p-2" : "p-3"} flex flex-col flex-1`}>
        <p className="text-[9px] font-body font-bold text-primary uppercase tracking-wider mb-0.5 truncate">{product.category}</p>
        <h3 className={`${compact ? "text-xs" : "text-sm"} font-body font-semibold text-foreground line-clamp-2 mb-1.5 flex-1 leading-tight`}>
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
          <span className="text-[9px] text-muted-foreground font-body">({product.reviewCount ?? 0})</span>
        </div>

        {/* Pricing + Cart */}
        <div className="flex items-center justify-between mt-auto gap-1.5">
          <div className="min-w-0">
            <span className={`${compact ? "text-sm" : "text-base"} font-body font-bold text-foreground`}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through font-body ml-1">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1 ${compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs"} rounded-full font-body font-semibold transition-all duration-300 flex-shrink-0 ${
              added ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
