import { motion, AnimatePresence } from "framer-motion";
import type { SilverProduct } from "@/data/silver-mock-data";
import { SilverProductCard } from "./SilverProductCard";

export function SilverProductGrid({
  products,
  onView,
}: {
  products: SilverProduct[];
  onView?: (p: SilverProduct) => void;
}) {
  return (
    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <AnimatePresence>
        {products.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <SilverProductCard product={p} onView={onView} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

