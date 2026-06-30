import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

// ── Stagger helpers ────────────────────────────────────────────────────────
const WORD = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Decorative SVG ─────────────────────────────────────────────────────────
function GoldRule() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9973a]/50" />
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)"
          fill="none" stroke="#c9973a" strokeWidth="1.2" strokeOpacity="0.7" />
        <rect x="7" y="7" width="4" height="4" transform="rotate(45 9 9)"
          fill="#c9973a" fillOpacity="0.5" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9973a]/50" />
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────
const CATS = [
  { label: "Kids",    emoji: "👧", href: "/collections?category=Kids"    },
  { label: "Men",     emoji: "👔", href: "/collections?category=Men"     },
  { label: "Women",   emoji: "👗", href: "/collections?category=Women"   },
  { label: "Festive", emoji: "✨", href: "/collections?category=Festive" },
];

const STATS = [
  { value: "90+", label: "Years" },
  { value: "1K+", label: "Families" },
  { value: "4",   label: "Collections" },
  { value: "₹",  label: "Best Prices" },
];

// ── Hero ──────────────────────────────────────────────────────────────────
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const imageY   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(150deg,#fdf8f0 0%,#faf1de 50%,#fdf6e8 100%)" }}
    >
      {/* Radial warmth blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 55% at 8% 18%, rgba(201,151,58,0.08) 0%, transparent 100%),
            radial-gradient(ellipse 50% 45% at 90% 82%, rgba(201,151,58,0.07) 0%, transparent 100%)
          `,
        }}
      />

      {/* ── Top eyebrow strip ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="relative z-10 mt-[64px] sm:mt-[72px] border-b border-[#c9973a]/18"
        style={{ background: "rgba(253,248,240,0.80)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 h-9 flex items-center justify-between">
          <span className="text-[9px] sm:text-[10px] font-body text-[#9a7030] tracking-[0.28em] uppercase font-semibold">
            Since 1930s · NMP Group
          </span>
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-[#c9973a] text-[#c9973a]" />)}
            <span className="text-[9px] sm:text-[10px] font-body text-[#9a7030] ml-2 tracking-wide hidden sm:block">1000+ Happy Families</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-body text-[#9a7030] tracking-[0.28em] uppercase font-semibold hidden sm:block">
            Chidambaram · Tamil Nadu
          </span>
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <div className="relative z-10 flex-1 max-w-[1360px] mx-auto w-full px-6 sm:px-10 lg:px-16 py-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-6 xl:gap-10 items-center">

        {/* LEFT — typographic block */}
        <motion.div style={{ y: contentY }} className="flex flex-col justify-center">

          {/* Tamil tagline */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-0.5 h-10 rounded-full" style={{ background: "linear-gradient(to bottom, #c9973a, transparent)" }} />
            <div>
              <p className="text-[#b07a28] font-display text-sm sm:text-base font-semibold tracking-wide">
                உங்கள் குடும்பத்திற்கான பாரம்பரியம்
              </p>
              <p className="text-[#c9973a]/50 text-[10px] font-body tracking-[0.22em] uppercase mt-0.5">
                Your Family's Tradition
              </p>
            </div>
          </motion.div>

          {/* Headline — 2 lines, large but controlled */}
          <div className="mb-5">
            {/* Line 1: "Dress Your" — dark */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display font-black leading-[1.0] tracking-tight text-[#160a00]"
                style={{ fontSize: "clamp(2.6rem, 5.8vw, 5.8rem)" }}
                variants={WORD} initial="hidden" animate="show" custom={0}
              >
                Dress Your
              </motion.h1>
            </div>
            {/* Line 2: "Family in Style" — gold gradient */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display font-black leading-[1.0] tracking-tight"
                style={{
                  fontSize: "clamp(2.6rem, 5.8vw, 5.8rem)",
                  background: "linear-gradient(105deg, #b07020 0%, #dda830 30%, #f5c84a 55%, #dda830 78%, #9a6018 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                variants={WORD} initial="hidden" animate="show" custom={1}
              >
                Family in Style
              </motion.h1>
            </div>
            {/* Line 3: "—" outline treatment for visual depth */}
            <div className="overflow-hidden mt-1">
              <motion.div
                className="font-display font-black leading-[0.9] tracking-tight"
                style={{
                  fontSize: "clamp(1rem, 2vw, 2rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(201,151,58,0.35)",
                  letterSpacing: "0.35em",
                }}
                variants={WORD} initial="hidden" animate="show" custom={2}
              >
                CHIDAMBARAM · TAMIL NADU · EST 1930
              </motion.div>
            </div>
          </div>

          {/* Gold ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mb-5 origin-left"
          >
            <GoldRule />
          </motion.div>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-[#5a3a18]/75 text-sm sm:text-[15px] font-body font-light max-w-[440px] leading-[1.75] mb-7"
          >
            90+ years of trusted fashion for Men, Women & Kids — all under one roof at prices that make every family smile.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.78 }}
            className="flex flex-wrap gap-3 items-center mb-6"
          >
            <button
              onClick={() => scrollTo("#collections")}
              className="group inline-flex items-center gap-2.5 bg-[#160a00] text-[#f0c060] font-body font-bold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#c9973a] hover:text-[#160a00] hover:scale-105"
            >
              Explore Collections
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("#about")}
              className="inline-flex items-center gap-2 border border-[#c9973a]/40 text-[#7a5020] font-body font-semibold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full hover:border-[#c9973a] hover:bg-[#c9973a]/10 transition-all duration-300"
            >
              Our Legacy
            </button>
          </motion.div>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.92 }}
            className="flex flex-wrap gap-2"
          >
            {CATS.map((cat) => (
              <button
                key={cat.label}
                onClick={() => (window.location.href = cat.href)}
                className="flex items-center gap-1.5 border border-[#c9973a]/28 hover:border-[#c9973a]/70 bg-white/55 hover:bg-[#c9973a]/10 text-[#5a3a18] text-[10px] font-body font-semibold uppercase tracking-[0.14em] px-3.5 py-2 rounded-full transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <span className="text-sm leading-none">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — image showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative"
        >
          {/* Offset border frames (decorative depth) */}
          <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[1.75rem] border border-[#c9973a]/22" />
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[1.75rem] border border-[#c9973a]/10" />

          {/* Main photo */}
          <motion.div
            style={{ y: imageY, boxShadow: "0 20px 70px rgba(80,40,0,0.2), 0 4px 20px rgba(80,40,0,0.12)" }}
            className="relative rounded-[1.75rem] overflow-hidden"
          >
            <img
              src="/images/store-1.png"
              alt="Kasthuribai store"
              className="w-full object-cover"
              style={{
                height: "clamp(320px, 48vh, 520px)",
                objectPosition: "center 20%",
              }}
              loading="eager"
            />
            {/* Warm vignette at bottom */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(22,10,0,0.52) 0%, transparent 50%)" }} />

            {/* Location pin inside photo */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
              <span className="text-sm">📍</span>
              <div>
                <p className="text-white text-[10px] font-body font-bold leading-tight">Chidambaram, TN</p>
              </div>
            </div>
          </motion.div>

          {/* ★ Review badge — top right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.1 }}
            className="absolute -top-4 -right-4 bg-white border border-[#f0deb8] rounded-2xl shadow-[0_6px_28px_rgba(100,60,0,0.13)] px-4 py-3"
          >
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-[#c9973a] text-[#c9973a]" />)}
            </div>
            <p className="text-[#1a0e00] text-[11px] font-body font-bold leading-snug">"Best family store"</p>
            <p className="text-[#9a7030] text-[9px] font-body mt-0.5">— 1000+ Customers</p>
          </motion.div>

          {/* 90+ badge — bottom right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 1.25 }}
            className="absolute -bottom-4 -right-3 bg-[#160a00] rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.22)] px-4 py-3 text-center"
          >
            <p className="text-[#f0c060] font-display font-black text-2xl leading-none">90+</p>
            <p className="text-[#c9973a]/70 text-[9px] font-body uppercase tracking-[0.18em] mt-0.5">Years</p>
          </motion.div>

          {/* Small accent image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.05 }}
            className="absolute -bottom-14 left-0 w-32"
          >
            <div className="relative rounded-xl overflow-hidden border border-[#f0deb8] shadow-[0_4px_18px_rgba(80,40,0,0.14)]">
              <img src="/images/store-2.png" alt="store" className="w-full h-20 object-cover" loading="lazy" />
            </div>
            <div className="absolute -top-2 -right-2 bg-[#c9973a] text-[#160a00] text-[8px] font-body font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-full">
              New
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-10 border-t border-[#c9973a]/18" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#c9973a]/15"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 px-2">
                <span className="font-display font-black text-2xl text-[#160a00] leading-none">{s.value}</span>
                <span className="text-[9px] sm:text-[10px] font-body font-semibold uppercase tracking-[0.2em] text-[#9a7030] mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-16 left-8 z-10 hidden xl:flex flex-col items-center gap-1.5"
      >
        <span className="text-[8px] font-body tracking-[0.35em] uppercase text-[#9a7030]/55"
          style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#c9973a]/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
