import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";

export function CartToast() {
  const { lastAdded } = useCart();

  return (
    <AnimatePresence>
      {lastAdded && (
        <motion.div
          key={lastAdded.id + lastAdded.addedAt}
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 max-w-xs"
        >
          {/* Product thumbnail */}
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img src={lastAdded.image} alt={lastAdded.name} className="w-full h-full object-cover" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-body font-bold text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Added to bag
            </p>
            <p className="text-xs font-body font-semibold text-foreground truncate">{lastAdded.name}</p>
            <p className="text-[11px] font-body text-muted-foreground">{formatPrice(lastAdded.price)}</p>
          </div>

          {/* Cart icon */}
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
