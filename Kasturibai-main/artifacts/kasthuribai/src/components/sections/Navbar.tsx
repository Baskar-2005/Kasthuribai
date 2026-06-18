import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { cn } from "@/lib/utils";
import { SpinWheel } from "@/components/SpinWheel";
import { PRODUCTS } from "@/data/mock-data";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Men", href: "/collections?category=Men" },
  { name: "Women", href: "/collections?category=Women" },
  { name: "Kids", href: "/collections?category=Kids" },
  { name: "Festival", href: "/collections?category=Festive" },
  { name: "Collections", href: "/collections" },
  { name: "Video Shopping", href: "/video-shopping" },
  { name: "My Orders", href: "/my-orders" },
];

function KasthuribaiLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group flex-shrink-0 focus:outline-none"
      aria-label="Kasthuribai Ready Mades – Home"
    >
      {/* Logo image */}
      <img
        src="/favicon.png"
        alt="Kasthuribai Logo"
        width="32"
        height="32"
        className="flex-shrink-0 sm:w-[38px] sm:h-[38px]"
      />

      {/* Brand text */}
      <div className="flex flex-col leading-none">
        <span
          className="font-logo text-[13px] sm:text-[15px] font-semibold tracking-[0.18em] text-foreground group-hover:text-primary transition-colors uppercase"
        >
          Kasthuribai
        </span>
        <span className="font-body text-[6.5px] sm:text-[7.5px] tracking-[0.25em] text-gold uppercase font-semibold -mt-0.5">
          Company · NMP Readymades
        </span>
      </div>
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileCollections, setIsMobileCollections] = useState(false);
  useEffect(() => {
    const checkPath = () => {
      setIsMobileCollections(window.innerWidth < 768 && window.location.pathname === '/collections');
    };
    window.addEventListener('resize', checkPath);
    checkPath();
    return () => window.removeEventListener('resize', checkPath);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<typeof PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const { getCartCount, setIsOpen, cartBounce } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      ).slice(0, 6); // Limit to 6 suggestions
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
    
    // Check if it's a hash link (same page navigation)
    if (href.startsWith("/#")) {
      const elementId = href.substring(2);
      const el = document.getElementById(elementId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 74;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      // It's a different page, use window.location
      window.location.href = href;
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    // Navigate to collections page with product highlight
    window.location.href = `/collections?product=${productId}`;
  };

  return (
    <>
      {/* Mobile search bar - always visible at top on mobile, separate from navbar */}
      <div ref={mobileSearchRef} className="md:hidden sticky top-0 z-40 px-3 sm:px-4 py-2 bg-white/97 backdrop-blur-lg">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
            className="w-full bg-secondary border border-border rounded-full py-1.5 pl-8 pr-4 text-[11px] font-body focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          
          {/* Mobile Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
              {searchSuggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{product.category} • ₹{product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav
        className={cn(
          "sticky z-40 w-full transition-all duration-300 border-b md:z-[35]",
          isMobileCollections && isScrolled 
            ? " -top-16 md:top-0 opacity-0 md:opacity-100"
            : "top-0 bg-white/97 backdrop-blur-lg border-gray-100 shadow-sm py-0"
        )}
      >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        {/* ───── DESKTOP layout: 3-column grid ───── */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6 h-[68px]">

          {/* LEFT – Logo */}
          <KasthuribaiLogo onClick={() => handleNavigation("/")} />

          {/* CENTER – Nav links */}
          <div className="flex items-center justify-center gap-4 lg:gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.href)}
                className="relative text-[10px] lg:text-[10.5px] font-body font-semibold uppercase tracking-[0.12em] text-gray-500 hover:text-primary transition-colors duration-200 group whitespace-nowrap py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold rounded-full transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* RIGHT – Search + Spin + Cart */}
          <div className="flex items-center gap-2">
            {/* Search pill */}
            <div ref={searchRef} className="relative">
              <div className={cn(
                "flex items-center gap-2 bg-secondary rounded-full border transition-all duration-300 overflow-hidden",
                searchFocused
                  ? "border-primary/50 ring-2 ring-primary/10 w-48"
                  : "border-border w-36"
              )}>
                <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-3" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { setSearchFocused(true); searchQuery.trim().length > 0 && setShowSuggestions(true); }}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent py-2 pr-3 text-[11px] font-body text-foreground placeholder:text-muted-foreground outline-none w-full min-w-0"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="pr-2 flex-shrink-0">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              
              {/* Desktop Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.category} • ₹{product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spin Wheel button */}
            <SpinWheel />

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1.5 bg-primary text-white pl-3.5 pr-4 py-2 rounded-full hover:bg-primary/90 transition-colors text-[11px] font-body font-semibold"
            >
              <ShoppingBag className={cn("w-3.5 h-3.5", cartBounce && "animate-cart-bounce")} />
              <span>Bag</span>
              {getCartCount() > 0 && (
                <span className="w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full ml-0.5">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ───── MOBILE layout ───── */}
        <div className="md:hidden flex items-center h-14 gap-2 sm:gap-3">
          <button
            className="p-1.5 text-foreground hover:text-primary transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile logo – centered */}
          <div className="flex-1 flex justify-center">
            <KasthuribaiLogo onClick={() => handleNavigation("/")} />
          </div>

          {/* Mobile spin wheel */}
          <SpinWheel />

          {/* Mobile cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-secondary flex-shrink-0"
          >
            <ShoppingBag className={cn("w-5 h-5", cartBounce && "animate-cart-bounce")} />
            {getCartCount() > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={cn(
        "md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 overflow-hidden z-50",
        mobileMenuOpen ? "max-h-96 py-2" : "max-h-0"
      )}>
        <div className="flex flex-col px-3 sm:px-4">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.href)}
              className={cn(
                "text-left text-sm font-body font-medium text-foreground hover:text-primary transition-colors py-2.5",
                i < NAV_LINKS.length - 1 && "border-b border-gray-50"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
    </>
  );
}
