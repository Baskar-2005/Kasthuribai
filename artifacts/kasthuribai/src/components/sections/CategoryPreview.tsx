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
  limit = 6,
  onViewProduct,
}: CategoryPreviewProps) {
  const previewProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === category).slice(0, limit);
  }, [category, limit]);

  if (previewProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 sm:py-16 md:py-24 bg-gradient-to-b ${gradientFrom} ${gradientTo}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-primary font-body font-semibold text-xs sm:text-sm uppercase tracking-wider">
            {emoji} {title}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-1 mb-2 sm:mb-3">
            {title}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold rounded-full mx-auto"></div>
          <p className="text-sm sm:text-base text-muted-foreground font-body mt-4 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {previewProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard product={product} onView={onViewProduct} />
            </motion.div>
          ))}
        </motion.div>

        {/* Show More Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href={`/collections?category=${category}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-body font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Show More {title}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
