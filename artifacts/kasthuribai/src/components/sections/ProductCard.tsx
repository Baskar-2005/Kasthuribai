import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/mock-data";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  "New Arrival": "bg-emerald-500 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  "New Arrival": "NEW",
  "Best Seller": "BEST",
  "Trending":    "TREND",
  "Premium":     "PRO",
  "Hot":         "HOT",
  "Sale":        "SALE",
};

const PRIORITY = ["New Arrival", "Premium", "Trending", "Best Seller", "Hot", "Sale"];

export function ProductCard({ product, onView, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const topBadge = (product.badges ?? [])
    .slice()
    .sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b))[0] ?? null;

  return (
    <motion.div
      className="group bg-white rounded-xl overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={() => onView?.(product)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-gray-50 ${compact ? "aspect-[3/4]" : "aspect-[2/3]"}`}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* Badge */}
        {topBadge && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${BADGE_STYLES[topBadge] ?? "bg-primary text-white"}`}>
              {BADGE_LABELS[topBadge] ?? topBadge}
            </span>
          </div>
        )}

        {/* Discount bubble */}
        {discount > 0 && (
          <div className="absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow">
            -{discount}%
          </div>
        )}

        {/* Quick view + Add — slides up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 inset-x-0 flex items-center justify-between gap-1 px-2 pb-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={(e) => { e.stopPropagation(); onView?.(product); }}
                className="flex items-center justify-center w-7 h-7 bg-white/90 backdrop-blur-sm text-primary rounded-full shadow hover:bg-white transition-colors flex-shrink-0"
                whileTap={{ scale: 0.9 }}
                title="Quick View"
              >
                <Eye className="w-3 h-3" />
              </motion.button>

              <motion.button
                onClick={handleAddToCart}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow transition-colors flex-1 justify-center ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-white/90 backdrop-blur-sm text-primary hover:bg-primary hover:text-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-2.5 h-2.5" />
                {added ? "Added!" : "Add to Bag"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className={`${compact ? "p-2" : "p-2.5"} flex flex-col flex-1`}>
        <p className="text-[8px] font-bold text-primary uppercase tracking-widest mb-0.5 truncate">{product.category}</p>
        <h3 className={`${compact ? "text-[11px]" : "text-xs"} font-semibold text-gray-800 line-clamp-2 mb-1.5 flex-1 leading-snug`}>
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-2 h-2 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
          ))}
          <span className="text-[8px] text-gray-400 ml-0.5">({product.reviewCount ?? 0})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between gap-1 mt-auto">
          <div className="min-w-0">
            <span className={`${compact ? "text-sm" : "text-sm"} font-bold text-gray-900`}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[9px] text-gray-400 line-through ml-1">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {/* Desktop-only add button (shown when not hovered) */}
          <motion.button
            onClick={handleAddToCart}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold transition-all flex-shrink-0 ${
              added ? "bg-green-500 text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            }`}
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingBag className="w-2.5 h-2.5" />
            {added ? "✓" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
