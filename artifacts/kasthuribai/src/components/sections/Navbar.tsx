import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, X, User, ChevronDown, Package, UserCircle, Menu } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Kids", href: "/collections?category=Kids" },
  { name: "Men", href: "/collections?category=Men" },
  { name: "Women", href: "/collections?category=Women" },
  { name: "Collections", href: "/collections" },
  { name: "Video Shopping", href: "/video-shopping" },
  { name: "Silver Corner", href: "/silver-corner" },
];

const PROFILE_LINKS = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "My Orders", href: "/my-orders", icon: Package },
];

function KasthuribaiLogo({ onClick, light }: { onClick: () => void; light?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group flex-shrink-0 focus:outline-none"
      aria-label="Kasthuribai Ready Mades – Home"
    >
      <img
        src="/favicon.png"
        alt="Kasthuribai Logo"
        width="32"
        height="32"
        className="flex-shrink-0 sm:w-[38px] sm:h-[38px]"
      />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-logo text-[13px] sm:text-[15px] font-semibold tracking-[0.18em] uppercase transition-colors",
            light ? "text-white group-hover:text-gold" : "text-foreground group-hover:text-primary"
          )}
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { getCartCount, setIsOpen, cartBounce } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
      ).slice(0, 6);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchOpen(false);
    if (href.startsWith("/#")) {
      const el = document.getElementById(href.substring(2));
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 74;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchOpen(false);
    window.location.href = `/collections?product=${productId}`;
  };

  const isLight = !scrolled;

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all",
          scrolled ? "flex justify-center pt-3 px-4" : ""
        )}
        initial={false}
      >
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "w-full transition-all duration-400",
            scrolled
              ? "max-w-5xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60 rounded-2xl px-4 py-2"
              : "bg-transparent px-3 sm:px-4 md:px-6 lg:px-8 py-0"
          )}
        >
          {/* ─── DESKTOP ─── */}
          <div className="hidden md:flex items-center h-[62px] gap-6">

            {/* Logo */}
            <KasthuribaiLogo onClick={() => handleNavigation("/")} light={isLight} />

            {/* Nav links */}
            <div className="flex items-center gap-1 lg:gap-2 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    "relative text-[10px] lg:text-[11px] font-body font-semibold uppercase tracking-[0.12em] transition-colors duration-200 group whitespace-nowrap px-2 py-1.5 rounded-lg",
                    isLight
                      ? "text-white/85 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0.5 left-2 right-2 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                    isLight ? "bg-gold" : "bg-gold"
                  )} />
                </button>
              ))}
            </div>

            {/* Right: Search + Bag + Profile */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div ref={searchRef} className="relative">
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.div
                      key="search-open"
                      initial={{ width: 36, opacity: 0.5 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 36, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={cn(
                        "flex items-center gap-2 rounded-full border overflow-hidden",
                        isLight
                          ? "bg-white/15 backdrop-blur-md border-white/30"
                          : "bg-gray-100 border-gray-200"
                      )}
                    >
                      <Search className={cn("w-3.5 h-3.5 flex-shrink-0 ml-3", isLight ? "text-white/70" : "text-gray-400")} />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          "bg-transparent py-2 pr-3 text-[11px] font-body outline-none w-full min-w-0",
                          isLight ? "text-white placeholder:text-white/50" : "text-foreground placeholder:text-muted-foreground"
                        )}
                      />
                      {searchQuery && (
                        <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="pr-2 flex-shrink-0">
                          <X className={cn("w-3 h-3", isLight ? "text-white/60" : "text-gray-400")} />
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-closed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchOpen(true)}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                        isLight
                          ? "text-white/80 hover:text-white hover:bg-white/15"
                          : "text-gray-500 hover:text-primary hover:bg-primary/8"
                      )}
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Search suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{product.category} · ₹{product.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart / Bag */}
              <button
                onClick={() => setIsOpen(true)}
                className={cn(
                  "relative flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full transition-all duration-200 text-[11px] font-body font-semibold",
                  isLight
                    ? "bg-white/15 backdrop-blur-md text-white border border-white/25 hover:bg-white/25"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <ShoppingBag className={cn("w-3.5 h-3.5", cartBounce && "animate-cart-bounce")} />
                <span>Bag</span>
                {getCartCount() > 0 && (
                  <span className="w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full ml-0.5">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-1 w-9 h-9 rounded-full transition-colors justify-center",
                    isLight
                      ? "text-white/80 hover:text-white hover:bg-white/15"
                      : "text-gray-500 hover:text-primary hover:bg-primary/8"
                  )}
                >
                  <User className="w-4 h-4" />
                  <ChevronDown className={cn("w-2.5 h-2.5 transition-transform duration-200", profileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {PROFILE_LINKS.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <item.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-body font-medium text-foreground">{item.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ─── MOBILE ─── */}
          <div className="md:hidden flex items-center h-14 gap-2">
            <button
              className={cn("p-1.5 transition-colors flex-shrink-0", isLight ? "text-white/90 hover:text-white" : "text-foreground hover:text-primary")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex-1 flex justify-center">
              <KasthuribaiLogo onClick={() => handleNavigation("/")} light={isLight} />
            </div>

            <button
              onClick={() => { setSearchOpen(!searchOpen); }}
              className={cn("w-9 h-9 flex items-center justify-center rounded-full transition-colors", isLight ? "text-white/90 hover:text-white hover:bg-white/15" : "text-gray-600 hover:text-primary hover:bg-primary/8")}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className={cn("relative w-9 h-9 flex items-center justify-center rounded-full transition-colors flex-shrink-0", isLight ? "text-white/90 hover:text-white hover:bg-white/15" : "text-gray-600 hover:text-primary hover:bg-secondary")}
            >
              <ShoppingBag className={cn("w-5 h-5", cartBounce && "animate-cart-bounce")} />
              {getCartCount() > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className={cn("flex items-center gap-2 rounded-full border mx-2 mb-2 overflow-hidden", isLight ? "bg-white/15 border-white/30" : "bg-gray-100 border-gray-200")}>
                  <Search className={cn("w-3.5 h-3.5 flex-shrink-0 ml-3", isLight ? "text-white/70" : "text-gray-400")} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn("bg-transparent py-2.5 pr-3 text-[12px] font-body outline-none w-full", isLight ? "text-white placeholder:text-white/50" : "text-foreground placeholder:text-muted-foreground")}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute top-full left-4 right-4 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 md:hidden",
                scrolled ? "bg-white/95 backdrop-blur-xl border-white/60" : "bg-black/70 backdrop-blur-xl border-white/20"
              )}
            >
              <div className="flex flex-col p-2">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className={cn(
                      "text-left text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl",
                      scrolled ? "text-foreground hover:bg-primary/8 hover:text-primary" : "text-white/90 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.name}
                  </button>
                ))}
                <div className={cn("my-1 h-px", scrolled ? "bg-gray-100" : "bg-white/15")} />
                {PROFILE_LINKS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center gap-3 text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl",
                      scrolled ? "text-foreground hover:bg-primary/8 hover:text-primary" : "text-white/90 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
