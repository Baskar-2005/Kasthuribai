import { useState } from "react";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";

import { SilverProduct } from "@/data/silver-mock-data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3 h-3",
            i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export function SilverProductCard({
  product,
  onView,
}: {
  product: SilverProduct;
  onView?: (product: SilverProduct) => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: "Kids" as any,
      subcategory: undefined as any,
      image: product.images[0],
      rating: product.rating,
      reviewCount: product.reviewCount,
      badges: product.isBestSeller ? ["Best Seller"] : product.isTrending ? ["Trending"] : product.isNewArrival ? ["New Arrival"] : [],
      description: `${product.description}\n\nPurity: ${product.purity}\nWeight: ${product.weight}`,
      sizes: undefined, colors: undefined, styles: undefined, features: undefined, material: undefined,
      care: product.careInstructions.join(" "),
    } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onClick={() => onView?.(product)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onView?.(product); } }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 cursor-pointer flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-50 aspect-[4/5]">
        <img
          src={imgError ? "/images/silver/anklets/anklets_1.png" : product.images[0]}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Silver shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/10 transition-all duration-700 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">New</span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">Best Seller</span>
          )}
          {product.discountPct > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">-{product.discountPct}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Wishlist"
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-gray-500")} />
        </button>

        {/* Stock warning */}
        {product.stockStatus === "Low Stock" && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold px-2.5 py-1 rounded-full text-center">
            Only a few left
          </div>
        )}

        {/* Hover action — tap card to open details */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex p-3">
          <button
            onClick={(e) => { e.stopPropagation(); onView?.(product); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] font-bold py-2.5 rounded-xl shadow-lg hover:bg-slate-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">{product.categoryTitle}</span>

        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2.5">
          <StarRow rating={product.rating} />
          <span className="text-[10px] text-slate-400 font-body">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
          <span className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-medium">{product.purity}</span>
          <span className="text-slate-300">·</span>
          <span>{product.weight}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900">{formatPrice(product.price)}</div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex-shrink-0",
              added
                ? "bg-emerald-500 text-white scale-105"
                : "bg-slate-900 text-white hover:bg-slate-700"
            )}
          >
            <ShoppingBag className="w-3 h-3" />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
