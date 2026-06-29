import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PRODUCTS, Product, Category } from "@/data/mock-data";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface CategoryPreviewProps {
  category: Category;
  title: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  limit?: number;
  onViewProduct?: (product: Product) => void;
}

export function CategoryPreview({
  category,
  title,
  subtitle,
  emoji,
  gradientFrom,
  gradientTo,
  limit = 8,
  onViewProduct,
}: CategoryPreviewProps) {
  const previewProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === category).slice(0, limit);
  }, [category, limit]);

  if (previewProducts.length === 0) return null;

  return (
    <section className={`py-10 sm:py-14 md:py-16 bg-gradient-to-b ${gradientFrom} ${gradientTo}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-primary font-body font-semibold text-xs uppercase tracking-wider">
              {emoji} {title}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mt-0.5 mb-2">
              {title}
            </h2>
            <div className="w-14 h-0.5 bg-gold rounded-full"></div>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-2 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href={`/collections?category=${category}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-body font-semibold text-primary hover:underline flex-shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Products Grid — compact, more columns */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3"
        >
          {previewProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <ProductCard product={product} onView={onViewProduct} compact />
            </motion.div>
          ))}
        </motion.div>

        {/* Show More */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href={`/collections?category=${category}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-body font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm"
          >
            Show More {title}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
