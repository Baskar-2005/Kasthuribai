import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/mock-data";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Trending": "bg-violet-500 text-white",
  "Sale": "bg-rose-500 text-white",
  "Premium": "bg-gray-800 text-white",
  "Hot": "bg-orange-500 text-white",
  "New Arrival": "bg-blue-500 text-white",
};

export function ProductCard({ product, onView }: ProductCardProps) {
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

  return (
    <div
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-350 cursor-pointer flex flex-col"
      onClick={() => onView?.(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* New badge - top left */}
        {product.badges?.includes("New Arrival") && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="text-[8px] sm:text-[10px] font-body font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-500 text-white">
              New
            </span>
          </div>
        )}

        {/* Premium/Trending badge - top right */}
        {(product.badges?.includes("Premium") || product.badges?.includes("Trending")) && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`text-[8px] sm:text-[10px] font-body font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider ${product.badges?.includes("Premium") ? "bg-gray-800 text-white" : "bg-violet-500 text-white"}`}>
              {product.badges?.includes("Premium") ? "Premium" : "Trending"}
            </span>
          </div>
        )}

        {/* Other badges - top left below New */}
        {product.badges?.filter(badge => !["New Arrival", "Premium", "Trending"].includes(badge)).map((badge, index) => (
          <div key={badge} className={`absolute left-2 sm:left-3 ${product.badges?.includes("New Arrival") ? "top-[42px] sm:top-[52px]" : "top-2 sm:top-3"}`} style={{ marginTop: index * 24 }}>
            <span className={`text-[8px] sm:text-[10px] font-body font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider ${BADGE_STYLES[badge] ?? "bg-primary text-white"}`}>
              {badge}
            </span>
          </div>
        ))}

        {/* Discount badge - bottom right */}
        {discount > 0 && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-9 h-9 sm:w-11 sm:h-11 bg-green-500 text-white text-[10px] sm:text-xs font-body font-bold rounded-full flex items-center justify-center shadow-md">
            -{discount}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => { e.stopPropagation(); onView?.(product); }}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <p className="text-[10px] sm:text-[10px] font-body font-bold text-primary uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-sm sm:text-sm font-body font-semibold text-foreground line-clamp-2 mb-2 sm:mb-2 flex-1 leading-tight">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2 sm:mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 sm:w-3 sm:h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
          <span className="text-[10px] sm:text-[10px] text-muted-foreground font-body">({product.reviewCount ?? 0})</span>
        </div>

        {/* Pricing + Cart */}
        <div className="flex items-center justify-between mt-auto gap-2 sm:gap-2">
          <div>
            <span className="text-base sm:text-base font-body font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-xs text-muted-foreground line-through font-body ml-1">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-full text-xs sm:text-xs font-body font-semibold transition-all duration-300 flex-shrink-0 ${
              added ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <ShoppingBag className="w-3 h-3 sm:w-3 sm:h-3" />
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
