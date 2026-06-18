import { useState, useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { OfferBanner } from "@/components/sections/OfferBanner";
// import { Products } from "@/components/sections/Products";
import { CategoryPreview } from "@/components/sections/CategoryPreview";
import { BestSellers } from "@/components/sections/BestSellers";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ProductModal } from "@/components/ProductModal";
import { Spinner } from "@/components/ui/spinner";
import { Product, Category } from "@/data/mock-data";
import { Truck, ShieldCheck, RotateCcw, Scissors } from "lucide-react";

function FeatureStrip() {
  const features = [
    { icon: <Truck className="w-5 h-5" />, title: "Free Shipping", desc: "On orders above ₹999", color: "text-blue-600 bg-blue-50" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Genuine Quality", desc: "100% authentic fabrics", color: "text-green-600 bg-green-50" },
    { icon: <RotateCcw className="w-5 h-5" />, title: "Easy Returns", desc: "7-day return policy", color: "text-amber-600 bg-amber-50" },
    { icon: <Scissors className="w-5 h-5" />, title: "Free Alteration", desc: "At our store", color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <h4 className="font-body font-semibold text-sm text-foreground">{f.title}</h4>
                <p className="text-xs font-body text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryFilter = (cat: Category) => {
    setActiveFilter(cat);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureStrip />
        <Categories onCategoryFilter={handleCategoryFilter} />
        <NewArrivals onViewProduct={setSelectedProduct} />
        <OfferBanner />
        
        
        {/* Category Preview Sections - Limited Products with Show More */}
        <CategoryPreview
          category="Men"
          title="Men's Wear"
          subtitle="Shirts, T-Shirts, Jeans & Formal Wear"
          emoji="👔"
          gradientFrom="from-blue-50/50"
          gradientTo="to-white"
          limit={6}
          onViewProduct={setSelectedProduct}
        />
        <CategoryPreview
          category="Women"
          title="Women's Wear"
          subtitle="Sarees, Kurtis, Chudidhar & Gowns"
          emoji="👗"
          gradientFrom="from-rose-50/50"
          gradientTo="to-white"
          limit={6}
          onViewProduct={setSelectedProduct}
        />
        <CategoryPreview
          category="Kids"
          title="Kids' Wear"
          subtitle="Colorful & Comfortable Collection for Kids"
          emoji="🧒"
          gradientFrom="from-green-50/50"
          gradientTo="to-white"
          limit={6}
          onViewProduct={setSelectedProduct}
        />
        <CategoryPreview
          category="Traditional"
          title="Traditional Wear"
          subtitle="Classic Ethnic Collection for Every Occasion"
          emoji="🎊"
          gradientFrom="from-amber-50/50"
          gradientTo="to-white"
          limit={6}
          onViewProduct={setSelectedProduct}
        />
        
        <BestSellers onViewProduct={setSelectedProduct} />
        <About />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />

      <CartDrawer />
      <CartToast />
      <FloatingWhatsApp />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
      />
    </div>
  );
}
