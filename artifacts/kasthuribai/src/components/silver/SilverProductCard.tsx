import { useState } from "react";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { SilverProduct } from "@/data/silver-mock-data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, "") || "919876543210";

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

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi! I want to order *${product.name}*\n\nPurity: ${product.purity}\nWeight: ${product.weight}\nPrice: ₹${product.price}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
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
          src={imgError ? "/images/silver/_fallback.jpg" : product.images[0]}
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

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-1.5 p-3">
          <button
            onClick={(e) => { e.stopPropagation(); onView?.(product); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-bold py-2.5 rounded-xl shadow-lg hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/95 backdrop-blur-sm text-white text-[11px] font-bold py-2.5 rounded-xl shadow-lg hover:bg-[#25D366] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order
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
