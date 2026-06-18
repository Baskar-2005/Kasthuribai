import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/sections/Navbar";
import { Products } from "@/components/sections/Products";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ProductModal } from "@/components/ProductModal";
import { Spinner } from "@/components/ui/spinner";
import { Product, Category } from "@/data/mock-data";

export default function Collections() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("category") as Category;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
  const [isLoading, setIsLoading] = useState(true);

  // Sync activeFilter with URL category param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newCategory = (params.get("category") as Category) || "All";
    setActiveFilter(newCategory as Category | "All");
  }, [window.location.search]);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  console.log('location:', location, 'activeFilter:', activeFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Loading Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Page Header - gradient banner only */}
        {/* <div className="bg-gradient-to-r from-primary/10 to-gold/10 py-8 sm:py-12 mb-8 sm:mb-12"> */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          </div>
        {/* </div> */}
        <Products
          onViewProduct={setSelectedProduct}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
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
