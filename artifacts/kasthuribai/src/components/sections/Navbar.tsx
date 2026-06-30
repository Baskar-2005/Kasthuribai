import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, X, User, ChevronDown, Package, UserCircle, Menu, Truck } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Kids",           href: "/collections?category=Kids"  },
  { name: "Men",            href: "/collections?category=Men"   },
  { name: "Women",          href: "/collections?category=Women" },
  { name: "Collections",    href: "/collections"                },
  { name: "Video Shopping", href: "/video-shopping"             },
  { name: "Silver Corner",  href: "/silver-corner"              },
];

const PROFILE_LINKS = [
  { name: "Profile",       href: "/profile",      icon: UserCircle },
  { name: "My Orders",     href: "/my-orders",    icon: Package    },
  { name: "Track Order",   href: "/track-order",  icon: Truck      },
];

function KasthuribaiLogo({ onClick, dark }: { onClick: () => void; dark: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group flex-shrink-0 focus:outline-none" aria-label="Kasthuribai – Home">
      <img src="/favicon.png" alt="Kasthuribai Logo" width="32" height="32" className="flex-shrink-0 sm:w-9 sm:h-9" />
      <div className="flex flex-col leading-none">
        <span className={cn(
          "font-logo text-[13px] sm:text-[14px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300",
          dark ? "text-foreground group-hover:text-primary" : "text-white group-hover:text-gold"
        )}>
          Kasthuribai
        </span>
        <span className="font-body text-[6.5px] sm:text-[7px] tracking-[0.25em] text-gold uppercase font-semibold -mt-0.5">
          Company · NMP Readymades
        </span>
      </div>
    </button>
  );
}

interface NavbarProps {
  isHome?: boolean;
}

function NavContent({
  dark,
  handleNavigation,
  searchRef,
  searchOpen,
  setSearchOpen,
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  searchSuggestions,
  handleSuggestionClick,
  profileRef,
  profileOpen,
  setProfileOpen,
  cartCount,
  setIsOpen,
  cartBounce,
}: any) {
  return (
    <>
      <KasthuribaiLogo onClick={() => handleNavigation("/")} dark={dark} />

      <div className="flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
        {NAV_LINKS.map((link) => (
          <button
            key={link.name}
            onClick={() => handleNavigation(link.href)}
            className={cn(
              "relative text-[10px] lg:text-[10.5px] font-body font-semibold uppercase tracking-[0.12em] transition-all duration-300 group whitespace-nowrap px-2.5 py-1.5 rounded-lg",
              dark
                ? "text-gray-700 hover:text-primary hover:bg-primary/6"
                : "text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            {link.name}
            <span className={cn(
              "absolute bottom-0.5 left-2.5 right-2.5 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
              dark ? "bg-gold" : "bg-gold"
            )} />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <div ref={searchRef} className="relative">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="open"
                initial={{ width: 36, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={cn(
                  "flex items-center gap-2 rounded-full border overflow-hidden",
                  dark ? "bg-gray-100/80 border-gray-200" : "bg-white/15 border-white/20 backdrop-blur-sm"
                )}
              >
                <Search className={cn("w-3.5 h-3.5 flex-shrink-0 ml-3", dark ? "text-gray-400" : "text-white/50")} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "bg-transparent py-2 pr-3 text-[11px] font-body outline-none w-full min-w-0",
                    dark ? "text-foreground placeholder:text-muted-foreground" : "text-white placeholder:text-white/50"
                  )}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="pr-2 flex-shrink-0">
                    <X className={cn("w-3 h-3", dark ? "text-gray-400" : "text-white/50")} />
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  dark ? "text-gray-600 hover:text-primary hover:bg-primary/8" : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {searchSuggestions.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <img src={product.image} alt={product.name} className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{product.category} · ₹{product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full transition-all duration-300 text-[11px] font-body font-semibold shadow-sm",
            dark ? "bg-primary text-white hover:bg-primary/90" : "bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm"
          )}
        >
          <ShoppingBag className={cn("w-3.5 h-3.5", cartBounce && "animate-cart-bounce")} />
          <span>Bag</span>
          {cartCount > 0 && (
            <span className="w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full ml-0.5">
              {cartCount}
            </span>
          )}
        </button>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={cn(
              "flex items-center gap-0.5 w-8 h-8 rounded-full transition-colors justify-center",
              dark ? "text-gray-600 hover:text-primary hover:bg-primary/8" : "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            <User className="w-4 h-4" />
            <ChevronDown className={cn("w-2.5 h-2.5 transition-transform duration-200", profileOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.14 }}
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
    </>
  );
}

export function Navbar({ isHome = false }: NavbarProps) {
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
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 70);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setScrolled(window.scrollY > 70);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      setSearchSuggestions(
        PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q)
        ).slice(0, 6)
      );
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
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  const handleSuggestionClick = (id: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchOpen(false);
    window.location.href = `/collections?product=${id}`;
  };

  const sharedProps = {
    handleNavigation,
    searchRef,
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    showSuggestions,
    setShowSuggestions,
    searchSuggestions,
    handleSuggestionClick,
    profileRef,
    profileOpen,
    setProfileOpen,
    cartCount: getCartCount(),
    setIsOpen,
    cartBounce,
  };

  // ── Non-home: always-visible sticky white navbar ──
  if (!isHome) {
    return (
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="hidden md:flex items-center h-[62px] gap-5">
            <NavContent dark={true} {...sharedProps} />
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex items-center h-14 gap-2">
            <button className="p-1.5 transition-colors flex-shrink-0 text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex-1 flex justify-center">
              <KasthuribaiLogo onClick={() => handleNavigation("/")} dark={true} />
            </div>
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(true)} className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-600">
              <ShoppingBag className={cn("w-4.5 h-4.5", cartBounce && "animate-cart-bounce")} />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="md:hidden overflow-hidden">
                <div className="flex items-center gap-2 rounded-full border mx-1 mb-2 overflow-hidden bg-gray-100 border-gray-200">
                  <Search className="w-3.5 h-3.5 flex-shrink-0 ml-3 text-gray-400" />
                  <input autoFocus type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent py-2.5 pr-3 text-[12px] font-body outline-none w-full text-foreground placeholder:text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute left-3 right-3 mt-1 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 md:hidden bg-white">
              <div className="flex flex-col p-2">
                {NAV_LINKS.map((link) => (
                  <button key={link.name} onClick={() => handleNavigation(link.href)} className="text-left text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl text-foreground hover:bg-primary/8 hover:text-primary">
                    {link.name}
                  </button>
                ))}
                <div className="my-1 h-px bg-gray-100" />
                {PROFILE_LINKS.map((item) => (
                  <button key={item.name} onClick={() => handleNavigation(item.href)} className="flex items-center gap-3 text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl text-foreground hover:bg-primary/8 hover:text-primary">
                    <item.icon className="w-4 h-4" /> {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }

  // ── Home navbar: transparent at top → glass pill when scrolled ──
  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={scrolled ? { y: 0 } : { y: 0 }}
      >
        <AnimatePresence mode="wait">
          {scrolled ? (
            /* Scrolled: glass pill */
            <motion.div
              key="scrolled"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-4 pt-3"
            >
              <div className="mx-auto max-w-[1100px] rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.18)] bg-white/90 backdrop-blur-2xl border-white/60 px-5 py-2">
                <div className="hidden md:flex items-center h-[56px] gap-5">
                  <NavContent dark={true} {...sharedProps} />
                </div>
                {/* Mobile scrolled */}
                <div className="md:hidden flex items-center h-12 gap-2">
                  <button className="p-1.5 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 flex justify-center">
                    <KasthuribaiLogo onClick={() => handleNavigation("/")} dark={true} />
                  </div>
                  <button onClick={() => setIsOpen(true)} className="relative w-8 h-8 flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5 text-foreground" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full">{getCartCount()}</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* At top: transparent full-width */
            <motion.div
              key="top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-black/60 to-transparent"
            >
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="hidden md:flex items-center h-[68px] gap-5">
                  <NavContent dark={false} {...sharedProps} />
                </div>
                {/* Mobile top */}
                <div className="md:hidden flex items-center h-16 gap-2">
                  <button className="p-1.5 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 flex justify-center">
                    <KasthuribaiLogo onClick={() => handleNavigation("/")} dark={false} />
                  </div>
                  <button onClick={() => setIsOpen(true)} className="relative w-8 h-8 flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5 text-white" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full">{getCartCount()}</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-3 right-3 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] bg-white"
          >
            <div className="flex flex-col p-2">
              {NAV_LINKS.map((link) => (
                <button key={link.name} onClick={() => handleNavigation(link.href)} className="text-left text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl text-foreground hover:bg-primary/8 hover:text-primary">
                  {link.name}
                </button>
              ))}
              <div className="my-1 h-px bg-gray-100" />
              {PROFILE_LINKS.map((item) => (
                <button key={item.name} onClick={() => handleNavigation(item.href)} className="flex items-center gap-3 text-sm font-body font-medium transition-colors px-4 py-3 rounded-xl text-foreground hover:bg-primary/8 hover:text-primary">
                  <item.icon className="w-4 h-4" /> {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
