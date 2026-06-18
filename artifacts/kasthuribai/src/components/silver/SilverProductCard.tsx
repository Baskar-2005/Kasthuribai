import { useState } from "react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { SilverProduct } from "@/data/silver-mock-data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function computeDiscountPct(p: SilverProduct) {
  if (!p.originalPrice) return 0;
  return p.discountPct;
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
  const discountPct = computeDiscountPct(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Adapt SilverProduct to existing cart Product interface by using the cart's fields.
    // NOTE: Cart/payment logic uses `name`, `price`, `image`, `category`, etc.
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
      sizes: undefined,
      colors: undefined,
      styles: undefined,
      features: undefined,
      material: undefined,
      care: product.careInstructions.join(" "),
    } as any);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      onClick={() => onView?.(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden bg-slate-50 aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount badge */}
{discountPct > 0 && (
          <div
            className={`absolute top-3 left-3 text-white text-[10px] font-body font-bold px-2.5 py-1 rounded-full ${
              product.stockStatus !== "In Stock" ? "bg-red-600" : "bg-amber-500"
            }`}
          >
            -{discountPct}%
          </div>
        )}

        {/* Stock badge */}
        {product.stockStatus !== "In Stock" && (
          <div className="absolute top-3 right-3 bg-red-50 border border-red-200 text-red-700 text-[10px] font-body font-bold px-2.5 py-1 rounded-full">
            {product.stockStatus}
          </div>
        )}



        {/* Hover overlay buttons */}


        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(product);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 hover:text-white transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-body font-bold text-slate-700 uppercase tracking-wider">
            {product.categoryTitle}
          </span>
        </div>

        <h3 className="mt-2 text-sm font-body font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-[10px] font-body font-semibold text-slate-700">{product.purity}</div>
          <div className="text-[10px] text-slate-500">• {product.weight}</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-body font-bold text-slate-900">{formatPrice(product.price)}</div>
            <div className="text-[11px] text-slate-500 line-through font-body">
              {product.originalPrice ? formatPrice(product.originalPrice) : ""}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-body font-semibold transition-all duration-300 flex-shrink-0",
              added ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
            )}
            type="button"
          >
            <ShoppingBag className="w-3 h-3" />
            {added ? "Added" : "Add"}
          </button>
        </div>

        <div className="mt-auto pt-3 hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // "Buy Now" opens details for now; cart/checkout still uses existing system.
              onView?.(product);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-colors text-xs font-body font-semibold text-slate-700"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

