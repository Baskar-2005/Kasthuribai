import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { SilverProduct, SILVER_PRODUCTS } from "@/data/silver-mock-data";
import { formatPrice } from "@/lib/utils";
import { SilverWhatsAppOrderButton } from "@/components/silver/SilverWhatsAppOrderButton";
import { useCart } from "@/store/use-cart";
import { cn } from "@/lib/utils";

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(sz, i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
      ))}
    </div>
  );
}

export function SilverProductDetailsModal({
  product,
  onClose,
  onSelectProduct,
}: {
  product: SilverProduct | null;
  onClose: () => void;
  onSelectProduct: (p: SilverProduct) => void;
  /** kept for API compat but no longer needed */ renderWhatsApp?: (p: SilverProduct) => React.ReactNode;
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) { setActiveImgIdx(0); setImgError(false); setAdded(false); }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    return () => { document.body.style.overflow = prev; document.body.style.paddingRight = ""; };
  }, [product]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!product) return;
      if (e.key === "ArrowLeft") setActiveImgIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActiveImgIdx(i => Math.min(product.images.length - 1, i + 1));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, product]);

  const related = useMemo((): SilverProduct[] => {
    if (!product) return [];
    return SILVER_PRODUCTS.filter(p => p.id !== product.id && p.categoryKey === product.categoryKey).slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice,
      category: "Kids" as any, subcategory: undefined as any, image: product.images[0],
      rating: product.rating, reviewCount: product.reviewCount,
      badges: product.isBestSeller ? ["Best Seller"] : [],
      description: `${product.description}\nPurity: ${product.purity}\nWeight: ${product.weight}`,
      sizes: undefined, colors: undefined, styles: undefined, features: undefined, material: undefined,
      care: product.careInstructions.join(" "),
    } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const activeImg = product
    ? (imgError ? "/images/silver/_fallback.jpg" : (product.images[activeImgIdx] ?? product.images[0]))
    : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.38 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* ── Gallery ── */}
              <div className="p-5 lg:p-7 border-b lg:border-b-0 lg:border-r border-gray-100">
                {/* Main image */}
                <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden group">
                  <img
                    src={activeImg ?? ""}
                    alt={product.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Silver shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/0 pointer-events-none" />

                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImgIdx(i => Math.max(0, i - 1))}
                        disabled={activeImgIdx === 0}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-700" />
                      </button>
                      <button
                        onClick={() => setActiveImgIdx(i => Math.min(product.images.length - 1, i + 1))}
                        disabled={activeImgIdx === product.images.length - 1}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isBestSeller && <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Best Seller</span>}
                    {product.isNewArrival && <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">New Arrival</span>}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImgIdx(i); setImgError(false); }}
                      className={cn(
                        "w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all",
                        i === activeImgIdx ? "border-slate-900 scale-105" : "border-transparent hover:border-slate-300"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" onError={() => {}} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Details ── */}
              <div className="p-5 lg:p-7 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">{product.categoryTitle}</p>
                <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight mb-3">{product.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <StarRow rating={product.rating} />
                  <span className="text-sm text-slate-500 font-body">
                    {product.rating.toFixed(1)} · {product.reviewCount} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-5">
                  <div className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</div>
                  {product.originalPrice > product.price && (
                    <div className="mb-1">
                      <div className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
                      <div className="text-xs text-emerald-600 font-bold">Save {product.discountPct}%</div>
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {[
                    { label: "Silver Purity", value: product.purity },
                    { label: "Weight",         value: product.weight },
                    { label: "Stock Status",   value: product.stockStatus },
                    { label: "Category",       value: product.categoryTitle },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-2xl px-3 py-3">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 font-body leading-relaxed mb-5">{product.description}</p>

                {/* Trust */}
                <div className="flex items-center gap-4 mb-5 text-xs text-slate-500 font-body">
                  {[
                    { icon: Shield, text: "BIS Hallmark" },
                    { icon: Truck, text: "Free Delivery" },
                    { icon: RotateCcw, text: "7-Day Return" },
                  ].map(t => (
                    <div key={t.text} className="flex items-center gap-1.5">
                      <t.icon className="w-3.5 h-3.5 text-slate-400" />
                      {t.text}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mb-6">
                  <SilverWhatsAppOrderButton product={product} />
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300",
                      added
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    )}
                  >
                    {added ? "Added to Cart!" : "Add to Cart"}
                  </button>
                </div>

                {/* Care & Shipping */}
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Care Instructions</p>
                    <ul className="space-y-1">
                      {product.careInstructions.map((c, i) => (
                        <li key={i} className="text-xs text-slate-600 font-body flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Shipping & Returns</p>
                    <p className="text-xs text-slate-600 font-body">{product.shippingInfo}</p>
                    <p className="text-xs text-slate-500 font-body mt-1">{product.returnPolicy}</p>
                  </div>
                </div>

                {/* Reviews */}
                <div className="mt-5">
                  <p className="font-display font-bold text-slate-900 text-base mb-3">Customer Reviews</p>
                  <div className="space-y-3">
                    {product.reviews.map(r => (
                      <div key={r.id} className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-slate-900">{r.name}</span>
                          <span className="text-[10px] text-slate-400">{r.date}</span>
                        </div>
                        <StarRow rating={r.rating} />
                        <p className="text-xs text-slate-600 font-body mt-2 leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div className="border-t border-slate-100 p-5 lg:p-7">
                <p className="font-display font-bold text-slate-900 text-base mb-4">You may also like</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {related.map(p => (
                    <button
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="group text-left rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square bg-slate-50 overflow-hidden">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => {}} />
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{p.name}</p>
                        <p className="text-xs text-slate-500 mt-1 font-body">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
