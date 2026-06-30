import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck, Award, Play } from "lucide-react";

// ─── Pre-computed fabric animation data (stays in Hero only) ──────────────

const THREAD_COLORS = [
  "rgba(212,167,48,0.45)",
  "rgba(255,255,255,0.22)",
  "rgba(232,218,185,0.35)",
  "rgba(240,192,96,0.40)",
  "rgba(212,167,48,0.28)",
];
interface Thread { id: number; x: number; len: number; angle: number; color: string; dur: number; delay: number; }
const THREADS: Thread[] = Array.from({ length: 18 }, (_, i) => ({
  id: i, x: (i / 18) * 110 - 5, len: 20 + (i % 5) * 10,
  angle: -12 + (i % 7) * 4, color: THREAD_COLORS[i % THREAD_COLORS.length],
  dur: 7 + (i % 6) * 1.8, delay: -(i * 1.1) % 10,
}));

const RIBBON_COLORS = ["rgba(212,167,48,0.14)","rgba(255,255,255,0.09)","rgba(240,192,96,0.12)"];
interface Ribbon { id: number; sx: number; w: number; color: string; dur: number; delay: number; d: number; }
const RIBBONS: Ribbon[] = Array.from({ length: 7 }, (_, i) => ({
  id: i, sx: 4 + (i / 7) * 92, w: 1.2 + (i % 3) * 1.2,
  color: RIBBON_COLORS[i % RIBBON_COLORS.length], dur: 10 + (i % 5) * 2, delay: -(i * 2) % 9,
  d: (i % 2 === 0 ? 10 : -10) + (i % 4) * 4,
}));

const FloatingThreads = memo(function FloatingThreads() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full">
        {THREADS.map((t) => (
          <line key={t.id}
            x1={`${t.x}%`} y1="0"
            x2={`${t.x + Math.sin((t.angle * Math.PI) / 180) * t.len}%`} y2={`${t.len}%`}
            stroke={t.color} strokeWidth={0.6 + (t.id % 3) * 0.3} strokeLinecap="round"
            style={{ animation: `threadFall ${t.dur}s ${t.delay}s linear infinite`, willChange: "transform, opacity" }}
          />
        ))}
      </svg>
    </div>
  );
});

const SilkRibbons = memo(function SilkRibbons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 107" preserveAspectRatio="none">
        {RIBBONS.map((r) => (
          <path key={r.id}
            d={`M ${r.sx} -2 Q ${r.sx + r.d * 0.6} 50, ${r.sx + r.d} 107`}
            fill="none" stroke={r.color} strokeWidth={r.w} strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ animation: `ribbonFloat ${r.dur}s ${r.delay}s ease-in-out infinite`, willChange: "transform, opacity" }}
          />
        ))}
      </svg>
    </div>
  );
});

// ─── Hero ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "90+",  label: "Years Legacy",       ta: "ஆண்டுகள்"         },
  { value: "1K+",  label: "Happy Customers",    ta: "வாடிக்கையாளர்கள்" },
  { value: "4",    label: "Collections",        ta: "தொகுப்புகள்"      },
  { value: "₹",   label: "Best Prices",         ta: "மலிவு விலை"       },
];

const CATS = [
  { label: "Kids",    emoji: "👧", href: "/collections?category=Kids"    },
  { label: "Men",     emoji: "👔", href: "/collections?category=Men"     },
  { label: "Women",   emoji: "👗", href: "/collections?category=Women"   },
  { label: "Festive", emoji: "✨", href: "/collections?category=Festive" },
];

export function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (!tick) {
        requestAnimationFrame(() => {
          if (parallaxRef.current)
            parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
          tick = false;
        });
        tick = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0 scale-110" style={{ willChange: "transform" }}>
          <img
            src="/images/store-1.png"
            alt="Kasthuribai Store"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
        {/* Warm amber tint overlay — lighter than before for a brighter feel */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, rgba(15,5,0,0.72) 0%, rgba(40,18,0,0.58) 40%, rgba(20,8,0,0.74) 100%)" }} />
        {/* Warm golden vignette on edges */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 130% 100% at 50% 60%, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />
        {/* Golden warm glow at center bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,167,48,0.18) 0%, transparent 70%)" }} />
      </div>

      {/* ── Fabric animations ── */}
      <FloatingThreads />
      <SilkRibbons />

      {/* ── Main content — full-width centered ── */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pt-28 pb-36">
        <div className="max-w-3xl w-full text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-7"
          >
            <div className="h-px w-10 bg-gold/50" />
            <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-gold/40 rounded-full px-4 py-1.5">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-gold font-body font-semibold tracking-[0.22em] uppercase text-[10px] sm:text-[11px]">
                Since 1930s · NMP Group · Chidambaram
              </span>
            </div>
            <div className="h-px w-10 bg-gold/50" />
          </motion.div>

          {/* Tamil subheading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gold/80 font-display text-lg sm:text-xl md:text-2xl font-semibold mb-5 tracking-wide"
          >
            உங்கள் குடும்பத்திற்கான பாரம்பரியம்
          </motion.p>

          {/* Main headline — large, cinematic */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-white leading-[1.04]"
              style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
            >
              Dress Your
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold leading-[1.04]"
              style={{
                fontSize: "clamp(3rem, 9vw, 7.5rem)",
                background: "linear-gradient(135deg,#d4a730 0%,#f0c94a 30%,#fff8e8 52%,#f0c94a 68%,#b8860b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Family in Style
            </motion.h1>
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/65 text-sm sm:text-base md:text-lg font-body font-light max-w-xl mx-auto mb-10 leading-relaxed"
          >
            90+ years of trusted fashion for Men, Women & Kids —
            all under one roof at prices that make every family smile.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.78 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10"
          >
            <button
              onClick={() => scrollTo("#collections")}
              className="group inline-flex items-center gap-2.5 bg-gold text-black font-body font-bold px-9 py-4 rounded-full text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:bg-amber-400"
              style={{ boxShadow: "0 0 40px rgba(212,167,48,0.5)" }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => scrollTo("#about")}
              className="inline-flex items-center gap-2.5 border border-white/28 text-white font-body font-semibold px-9 py-4 rounded-full text-sm uppercase tracking-wider backdrop-blur-sm hover:bg-white/10 hover:border-white/55 transition-all duration-300"
            >
              <Play className="w-3.5 h-3.5" />
              Our Legacy
            </button>
          </motion.div>

          {/* Category quick-links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="flex flex-wrap gap-2.5 justify-center"
          >
            {CATS.map((cat) => (
              <button
                key={cat.label}
                onClick={() => (window.location.href = cat.href)}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/18 hover:border-gold/55 text-white/88 hover:text-white text-[11px] font-body font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-250 hover:scale-105"
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Trust row — replaces the clunky side cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10"
          >
            {[
              { icon: Award,       text: "90+ Years Legacy"     },
              { icon: Star,        text: "1000+ Happy Families" },
              { icon: ShieldCheck, text: "100% Authentic"       },
              { icon: Truck,       text: "Pan-India Delivery"   },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-white/55 text-[11px] font-body">
                <Icon className="w-3 h-3 text-gold/70 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Soft gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="bg-black/50 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 py-5 divide-x divide-white/8"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-1 px-4">
                  <span className="text-gold font-display font-bold text-2xl sm:text-3xl leading-none">
                    {s.value}
                  </span>
                  <span className="text-white/70 text-[10px] sm:text-xs font-body font-medium uppercase tracking-wider mt-1">
                    {s.label}
                  </span>
                  <span className="text-gold/40 text-[9px] font-body mt-0.5">{s.ta}</span>
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
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none"
      >
        <span className="text-white/20 text-[9px] font-body tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
