import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CATEGORY_PILLS = [
  { label: "Kids", emoji: "👧", href: "/collections?category=Kids" },
  { label: "Men", emoji: "👔", href: "/collections?category=Men" },
  { label: "Women", emoji: "👗", href: "/collections?category=Women" },
  { label: "Festive", emoji: "✨", href: "/collections?category=Festive" },
];

const STATS = [
  { value: "90+", label: "Years Legacy", tamil: "ஆண்டுகள்" },
  { value: "1K+", label: "Happy Customers", tamil: "வாடிக்கையாளர்கள்" },
  { value: "4", label: "Collections", tamil: "தொகுப்புகள்" },
  { value: "₹", label: "Best Prices", tamil: "மலிவு விலை" },
];

export function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0 scale-110">
          <img
            src="/images/store-1.png"
            alt="Kasthuribai Store"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        {/* Warm tone accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 via-transparent to-transparent" />
      </div>

      {/* ── Decorative grain texture overlay ── */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pt-36 sm:pt-40 pb-32 sm:pb-36">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-gold/40 rounded-full px-4 py-1.5">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-gold font-body font-semibold tracking-[0.22em] uppercase text-[10px] sm:text-[11px]">
              Since 1930s · Chidambaram
            </span>
          </div>
        </motion.div>

        {/* Tamil heading */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gold/80 font-display text-lg sm:text-xl md:text-2xl font-semibold mb-3 tracking-wide"
        >
          உங்கள் குடும்பத்திற்கான பாரம்பரியம்
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-display font-bold text-white leading-[1.05] mb-2"
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Dress Your
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Family in{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #d4a730 0%, #f0c94a 40%, #b8860b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Style
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-white/70 text-sm sm:text-base md:text-lg font-body font-light max-w-xl mt-5 mb-8 leading-relaxed"
        >
          90+ years of trusted fashion for Men, Women & Kids — all under one roof at prices that make every family smile.
        </motion.p>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-2.5 mb-10"
        >
          {CATEGORY_PILLS.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.07 }}
              onClick={() => window.location.href = cat.href}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-gold/50 text-white text-[11px] sm:text-xs font-body font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <button
            onClick={() => scrollTo("#collections")}
            className="group inline-flex items-center justify-center gap-2 bg-gold text-black font-body font-bold px-7 sm:px-9 py-3.5 sm:py-4 rounded-full hover:bg-amber-400 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(212,167,48,0.4)] hover:shadow-[0_0_45px_rgba(212,167,48,0.6)] hover:scale-105"
          >
            Shop Now
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            onClick={() => scrollTo("#about")}
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-body font-semibold px-7 sm:px-9 py-3.5 sm:py-4 rounded-full hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider"
          >
            Our Legacy
          </button>
        </motion.div>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-r from-black/60 via-black/50 to-black/60 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 sm:py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-gold font-display font-bold text-xl sm:text-2xl">{stat.value}</span>
                  <span className="text-white/80 text-[10px] sm:text-xs font-body font-medium uppercase tracking-wider">{stat.label}</span>
                  <span className="text-gold/50 text-[9px] sm:text-[10px] font-body mt-0.5">{stat.tamil}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Decorative scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/30 text-[9px] font-body tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
