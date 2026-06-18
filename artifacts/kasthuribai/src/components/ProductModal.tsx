import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, Check, RefreshCw, Shield, Truck } from "lucide-react";
import { Product, PRODUCTS } from "@/data/mock-data";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const AVATAR_COLORS = ["bg-rose-100 text-rose-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : s - 0.5 <= rating ? "fill-amber-200 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

export function ProductModal({ product, onClose, onSelectProduct }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "features" | "returns">("details");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] ?? null);
      setAddedToCart(false);
      setActiveTab("details");
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = encodeURIComponent(`Hi! I want to order *${product.name}* (Size: ${selectedSize ?? "N/A"}) priced at ${formatPrice(product.price)}. Please confirm availability.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
  };

  const recommended = product ? PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4) : [];
  const discount = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto z-10 overflow-hidden my-auto"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Main Content: Image + Details */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Product Image */}
              <div className="relative bg-gray-50 aspect-square md:aspect-auto md:min-h-[460px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badges && product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badges.map((badge) => (
                      <span key={badge} className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Right: Product Details */}
              <div className="p-6 md:p-8 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                <div className="mb-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest font-body">{product.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3 leading-tight">{product.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-muted-foreground font-body">({product.reviewCount ?? 0} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl font-bold text-foreground font-body">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through font-body">{formatPrice(product.originalPrice)}</span>
                      <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-1 rounded-full font-body">{discount}% OFF</span>
                    </>
                  )}
                </div>

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-foreground mb-2 font-body">Select Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-body font-medium transition-all ${
                            selectedSize === size
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-secondary text-foreground hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-4 bg-secondary rounded-xl p-1">
                  {(["details", "features", "returns"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-xs font-body font-semibold rounded-lg capitalize transition-all ${
                        activeTab === tab ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {tab === "returns" ? "Return Policy" : tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="mb-6 min-h-[100px]">
                  {activeTab === "details" && (
                    <div>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">{product.description}</p>
                      {product.material && (
                        <p className="text-sm font-body"><span className="font-semibold text-foreground">Material:</span> <span className="text-muted-foreground">{product.material}</span></p>
                      )}
                    </div>
                  )}
                  {activeTab === "features" && (
                    <ul className="space-y-2">
                      {product.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "returns" && (
                    <div className="space-y-3">
                      {[
                        { icon: <RefreshCw className="w-4 h-4 text-blue-500" />, title: "7-Day Easy Returns", desc: "Not satisfied? Return within 7 days for a full exchange or refund." },
                        { icon: <Shield className="w-4 h-4 text-green-500" />, title: "Quality Guarantee", desc: "All products are quality-checked before dispatch." },
                        { icon: <Truck className="w-4 h-4 text-amber-500" />, title: "Free Alteration", desc: "Visit our store for complimentary minor alterations on all stitched items." },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-secondary rounded-xl">
                          {item.icon}
                          <div>
                            <p className="text-sm font-semibold text-foreground font-body">{item.title}</p>
                            <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                      addedToCart ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {addedToCart ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors font-body font-semibold text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
              <div className="border-t border-border px-6 md:px-8 py-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">You May Also Like</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommended.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => onSelectProduct(rec)}
                      className="group text-left bg-secondary rounded-xl overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-body font-semibold text-foreground line-clamp-1">{rec.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-sm font-bold font-body text-primary">{formatPrice(rec.price)}</span>
                          {rec.originalPrice && <span className="text-xs text-muted-foreground line-through font-body">{formatPrice(rec.originalPrice)}</span>}
                        </div>
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
