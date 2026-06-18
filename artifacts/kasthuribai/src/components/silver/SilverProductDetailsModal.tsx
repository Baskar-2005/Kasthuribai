import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star } from "lucide-react";
import { SilverProduct, SILVER_PRODUCTS } from "@/data/silver-mock-data";
import { formatPrice } from "@/lib/utils";
import { SilverProductCard } from "@/components/silver/SilverProductCard";

export function SilverProductDetailsModal({
  product,
  onClose,
  onSelectProduct,
  renderWhatsApp,
}: {
  product: SilverProduct | null;
  onClose: () => void;
  onSelectProduct: (p: SilverProduct) => void;
  renderWhatsApp: (p: SilverProduct) => React.ReactNode;
}) {
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    if (product) setActiveImg(product.images?.[0] ?? null);
  }, [product]);

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!product) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const related = useMemo((): SilverProduct[] => {
    if (!product) return [];
    return SILVER_PRODUCTS.filter(
      (p) => p.id !== product.id && p.categoryKey === product.categoryKey
    ).slice(0, 8);
  }, [product]);

  const zoom = activeImg;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto py-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Gallery */}
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative">
                  <img
                    src={zoom ?? product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {(product.images ?? []).map((img) => (
                    <button
                      key={img}
                      onClick={() => setActiveImg(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border ${
                        img === activeImg ? "border-slate-900" : "border-slate-200"
                      }`}
                      type="button"
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-body font-bold text-slate-600 uppercase tracking-wider">
                      {product.categoryTitle}
                    </p>
                    <h2 className="mt-2 text-2xl font-display font-bold text-slate-900">{product.name}</h2>
                  </div>

                  {product.discountPct > 0 && (
                    <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-body font-bold">
                      -{product.discountPct}%
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const s = i + 1;
                      return (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-slate-600 font-body">({product.reviewCount} reviews)</span>
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <div className="text-3xl font-body font-bold text-slate-900">{formatPrice(product.price)}</div>
                  {product.originalPrice > product.price && (
                    <div>
                      <div className="text-slate-500 line-through font-body text-sm">{formatPrice(product.originalPrice)}</div>
                      <div className="text-xs text-emerald-700 font-body font-bold">Great deal today</div>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-600 font-body font-bold">Silver Purity</p>
                      <p className="text-sm font-body font-bold text-slate-900">{product.purity}</p>
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-600 font-body font-bold">Weight</p>
                      <p className="text-sm font-body font-bold text-slate-900">{product.weight}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-600 font-body font-bold">Description</p>
                    <p className="text-sm text-slate-700 mt-1 font-body">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-600 font-body font-bold">Care Instructions</p>
                      <ul className="mt-2 text-xs text-slate-700 space-y-1 font-body">
                        {(product.careInstructions ?? []).slice(0, 4).map((x, i) => (
                          <li key={i}>• {x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-600 font-body font-bold">Shipping</p>
                      <p className="mt-2 text-xs text-slate-700 font-body">{product.shippingInfo}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-600 font-body font-bold">Return Policy</p>
                    <p className="mt-2 text-xs text-slate-700 font-body">{product.returnPolicy}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-body font-bold text-slate-600 uppercase tracking-wider">WhatsApp Ordering</div>
                  <div className="mt-2">{renderWhatsApp(product)}</div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <h3 className="font-display font-bold text-slate-900">Customer Reviews</h3>
                  <div className="mt-3 space-y-3">
                    {(product.reviews ?? []).slice(0, 3).map((r) => (
                      <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-body font-bold text-slate-900">{r.name}</div>
                          <div className="text-xs font-body text-slate-600">{r.date}</div>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const s = i + 1;
                              return (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= Math.round(r.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200 fill-gray-200"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <div className="text-xs text-slate-700 font-body font-bold">{r.rating.toFixed(1)}</div>
                        </div>

                        <p className="text-xs text-slate-700 mt-2 font-body">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="border-t border-slate-100 p-6">
                <h3 className="font-display font-bold text-slate-900">Related Products</h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {related.map((p) => (
                    <SilverProductCard key={p.id} product={p} onView={onSelectProduct} />
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

