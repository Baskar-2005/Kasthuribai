import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

// ─── Pre-computed data (outside component = no re-render cost) ────────────

const THREAD_COLORS = [
  "rgba(212,167,48,0.55)",   // gold
  "rgba(255,255,255,0.35)",  // white
  "rgba(232,218,185,0.45)",  // beige
  "rgba(160,32,48,0.40)",    // maroon
  "rgba(240,192,96,0.50)",   // light gold
  "rgba(212,167,48,0.35)",   // gold dim
  "rgba(255,255,255,0.25)",  // white dim
  "rgba(200,170,100,0.45)",  // warm gold
];

interface Thread {
  id: number;
  x: number;
  y: number;
  len: number;
  angle: number;
  color: string;
  dur: number;
  delay: number;
  drift: number;
}

const THREADS: Thread[] = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i / 28) * 110 - 5,
  y: -5 - (i % 7) * 15,
  len: 18 + (i % 5) * 12,
  angle: -15 + (i % 9) * 5,
  color: THREAD_COLORS[i % THREAD_COLORS.length],
  dur: 6 + (i % 6) * 1.5,
  delay: -(i * 0.8) % 9,
  drift: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 4),
}));

interface Ribbon {
  id: number;
  startX: number;
  width: number;
  color: string;
  dur: number;
  delay: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  opacity: number;
}

const RIBBON_COLORS = [
  "rgba(212,167,48,0.18)",
  "rgba(255,255,255,0.12)",
  "rgba(232,218,185,0.15)",
  "rgba(160,32,48,0.12)",
  "rgba(240,192,96,0.16)",
  "rgba(212,167,48,0.10)",
];

const RIBBONS: Ribbon[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startX: 5 + (i / 8) * 90,
  width: 1.5 + (i % 3) * 1.5,
  color: RIBBON_COLORS[i % RIBBON_COLORS.length],
  dur: 9 + (i % 5) * 2,
  delay: -(i * 1.5) % 8,
  cp1x: -15 + (i % 5) * 8,
  cp1y: 20 + (i % 4) * 10,
  cp2x: 15 - (i % 3) * 10,
  cp2y: 60 + (i % 3) * 10,
  opacity: 0.6 + (i % 4) * 0.1,
}));

interface Particle {
  id: number;
  x: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  glow: string;
}

const PARTICLES: Particle[] = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 3 + (i / 22) * 94,
  size: 1.5 + (i % 3) * 1,
  dur: 5 + (i % 5) * 1.2,
  delay: -(i * 0.6) % 7,
  drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 6) * 7),
  glow: i % 3 === 0 ? "rgba(240,192,96,0.9)" : "rgba(212,167,48,0.7)",
}));

// ─── Sub-components (memoized for perf) ──────────────────────────────────

const FloatingThreads = memo(function FloatingThreads() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }}>
        {THREADS.map((t) => (
          <line
            key={t.id}
            x1={`${t.x}%`} y1="0"
            x2={`${t.x + Math.sin((t.angle * Math.PI) / 180) * t.len}%`}
            y2={`${t.len}%`}
            stroke={t.color}
            strokeWidth={0.8 + (t.id % 3) * 0.4}
            strokeLinecap="round"
            style={{
              animation: `threadFall ${t.dur}s ${t.delay}s linear infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </svg>
    </div>
  );
});

const SilkRibbons = memo(function SilkRibbons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }}>
        {RIBBONS.map((r) => (
          <path
            key={r.id}
            d={`M ${r.startX}% -2% C ${r.startX + r.cp1x}% ${r.cp1y}%, ${r.startX + r.cp2x}% ${r.cp2y}%, ${r.startX + r.drift}% 105%`}
            fill="none"
            stroke={r.color}
            strokeWidth={r.width}
            strokeLinecap="round"
            style={{
              animation: `ribbonFloat ${r.dur}s ${r.delay}s ease-in-out infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </svg>
    </div>
  );
});

const GoldenParticles = memo(function GoldenParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -4,
            width: p.size,
            height: p.size,
            background: p.glow,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.glow}`,
            animation: `particleRise ${p.dur}s ${p.delay}s ease-out infinite`,
            willChange: "transform, opacity",
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
});

// ─── Hero ─────────────────────────────────────────────────────────────────

export function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background with parallax ── */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0 scale-110" style={{ willChange: "transform" }}>
          <img
            src="/images/store-1.png"
            alt="Kasthuribai Store"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0308]/70 via-transparent to-transparent" />
      </div>

      {/* ── Animated fabric effects (CSS-driven = GPU, zero lag) ── */}
      <FloatingThreads />
      <SilkRibbons />
      <GoldenParticles />

      {/* ── Main centered content ── */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-5 sm:px-8 lg:px-12 pt-28 pb-36">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 mb-7"
        >
          <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-gold/35 rounded-full px-4 py-1.5">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-gold font-body font-semibold tracking-[0.22em] uppercase text-[10px] sm:text-[11px]">
              Since 1930s · NMP Group · Chidambaram
            </span>
          </div>
        </motion.div>

        {/* Tamil subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gold/75 font-display text-base sm:text-lg md:text-xl font-semibold mb-4 tracking-wide"
        >
          உங்கள் குடும்பத்திற்கான பாரம்பரியம்
        </motion.p>

        {/* Main headline — center, big, staggered */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05]"
          >
            Dress Your
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05]"
            style={{
              background: "linear-gradient(135deg,#d4a730 0%,#f0c94a 35%,#fff8e8 55%,#f0c94a 70%,#b8860b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Family in Style
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-white/65 text-sm sm:text-base md:text-lg font-body font-light max-w-lg mt-4 mb-10 leading-relaxed"
        >
          90+ years of trusted fashion for Men, Women & Kids — all under one roof at prices that make every family smile.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
        >
          <button
            onClick={() => scrollTo("#collections")}
            className="group inline-flex items-center gap-2 bg-gold text-black font-body font-bold px-8 py-3.5 rounded-full hover:bg-amber-400 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(212,167,48,0.45)] hover:shadow-[0_0_50px_rgba(212,167,48,0.65)] hover:scale-105 will-change-transform"
          >
            Shop Now
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            onClick={() => scrollTo("#about")}
            className="inline-flex items-center gap-2 border border-white/25 text-white font-body font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider"
          >
            Our Legacy
          </button>
        </motion.div>

        {/* Category quick-links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap gap-2 mt-10 justify-center"
        >
          {[
            { label: "Kids", emoji: "👧", href: "/collections?category=Kids" },
            { label: "Men", emoji: "👔", href: "/collections?category=Men" },
            { label: "Women", emoji: "👗", href: "/collections?category=Women" },
            { label: "Festive", emoji: "✨", href: "/collections?category=Festive" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => (window.location.href = cat.href)}
              className="flex items-center gap-1.5 bg-white/8 backdrop-blur-sm hover:bg-white/16 border border-white/15 hover:border-gold/50 text-white/85 hover:text-white text-[11px] font-body font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-250 hover:scale-105"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-black/45 backdrop-blur-md border-t border-white/8">
          <div className="max-w-5xl mx-auto px-5 py-4 sm:py-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
            >
              {[
                { value: "90+", label: "Years Legacy", ta: "ஆண்டுகள்" },
                { value: "1K+", label: "Happy Customers", ta: "வாடிக்கையாளர்கள்" },
                { value: "4", label: "Collections", ta: "தொகுப்புகள்" },
                { value: "₹", label: "Best Prices", ta: "மலிவு விலை" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-gold font-display font-bold text-xl sm:text-2xl">{s.value}</span>
                  <span className="text-white/75 text-[10px] sm:text-xs font-body font-medium uppercase tracking-wider">{s.label}</span>
                  <span className="text-gold/45 text-[9px] sm:text-[10px] font-body mt-0.5">{s.ta}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/25 text-[9px] font-body tracking-[0.28em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}
