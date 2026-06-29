import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Animated mandala rings ─────────────────────────────────────────────────
function MandalRings() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="w-48 h-48 sm:w-56 sm:h-56"
      aria-hidden="true"
    >
      {/* Outer slow ring */}
      <motion.circle
        cx="120" cy="120" r="108"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="0.8"
        strokeDasharray="8 6"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        style={{ transformOrigin: "120px 120px" }}
      />
      {/* Mid ring — reverse */}
      <motion.circle
        cx="120" cy="120" r="90"
        fill="none"
        stroke="url(#goldGrad2)"
        strokeWidth="1.2"
        strokeDasharray="4 12"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        style={{ transformOrigin: "120px 120px" }}
      />
      {/* Inner ring */}
      <motion.circle
        cx="120" cy="120" r="72"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="0.6"
        strokeDasharray="3 9"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        style={{ transformOrigin: "120px 120px" }}
      />

      {/* 8 ornament dots on outer ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = 120 + 108 * Math.cos(angle);
        const y = 120 + 108 * Math.sin(angle);
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r="2.5"
            fill="#D4A035"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: i * 0.31,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* 4-petal lotus in center */}
      <motion.path
        d="M120 100 Q130 110 120 120 Q110 110 120 100Z
           M140 120 Q130 130 120 120 Q130 110 140 120Z
           M120 140 Q110 130 120 120 Q130 130 120 140Z
           M100 120 Q110 110 120 120 Q110 130 100 120Z"
        fill="url(#goldGrad)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "120px 120px" }}
      />

      {/* Center dot */}
      <motion.circle
        cx="120" cy="120" r="4"
        fill="#F0C060"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ delay: 0.9, duration: 0.5 }}
      />

      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A035" />
          <stop offset="50%" stopColor="#F0C060" />
          <stop offset="100%" stopColor="#B8820A" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0C060" />
          <stop offset="100%" stopColor="#D4A035" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Letter-by-letter reveal for store name ────────────────────────────────
const STORE_NAME = "KASTHURIBAI";

function StoreNameReveal() {
  return (
    <motion.div
      className="flex items-center justify-center gap-[2px] sm:gap-1"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } },
        hidden: {},
      }}
    >
      {STORE_NAME.split("").map((char, i) => (
        <motion.span
          key={i}
          className="font-logo text-2xl sm:text-3xl md:text-4xl tracking-[0.18em] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #B8820A 0%, #F0C060 40%, #D4A035 60%, #F5D78A 80%, #B8820A 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ── Shimmer divider line ──────────────────────────────────────────────────
function GoldLine() {
  return (
    <motion.div
      className="relative h-px w-48 sm:w-64 mx-auto overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6 }}
    >
      {/* Static line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      {/* Travelling shimmer */}
      <motion.div
        className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
        animate={{ x: ["-4rem", "20rem"] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 1.8 }}
      />
    </motion.div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mx-auto">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #B8820A, #F0C060, #D4A035)",
          width: `${progress}%`,
        }}
        transition={{ duration: 0.05 }}
      />
      {/* Glowing tip */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_4px_rgba(240,192,96,0.6)]"
        style={{ left: `calc(${progress}% - 4px)` }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
}

// ── Floating gold particles ────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-300/40"
          style={{
            left: `${p.x}%`,
            bottom: "-4px",
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -(300 + Math.random() * 300)],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Curtain exit panels ────────────────────────────────────────────────────
// Left and right halves that slide apart revealing the page behind.
// Rendered OUTSIDE the main content so they clip the entire viewport.
function CurtainPanels({ exiting }: { exiting: boolean }) {
  return (
    <>
      {/* Left panel */}
      <motion.div
        className="fixed inset-y-0 left-0 z-[9998]"
        style={{ width: "50vw", background: "linear-gradient(135deg, #1a0308 0%, #0f0205 100%)" }}
        animate={exiting ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
      {/* Right panel */}
      <motion.div
        className="fixed inset-y-0 right-0 z-[9998]"
        style={{ width: "50vw", background: "linear-gradient(225deg, #1a0308 0%, #0f0205 100%)" }}
        animate={exiting ? { x: "100%" } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}

// ── Main LoadingScreen ─────────────────────────────────────────────────────
interface LoadingScreenProps {
  onExitComplete: () => void;
}

export function LoadingScreen({ onExitComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [showCurtains, setShowCurtains] = useState(true);

  // Drive progress bar
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const DURATION = 2400; // ms to fill bar (loading phase)

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      }
    };
    // Delay start slightly so rings appear first
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 900);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Trigger exit after content is fully loaded (progress = 100 + small pause)
  useEffect(() => {
    if (progress < 100) return;
    const timer = setTimeout(() => {
      setExiting(true);
      // Hide center content slightly before curtains close
      // Curtains take 0.8s — notify parent after they're gone
      setTimeout(() => {
        setShowCurtains(false);
        onExitComplete();
      }, 850);
    }, 300); // tiny pause at 100% before exit
    return () => clearTimeout(timer);
  }, [progress, onExitComplete]);

  return (
    <>
      {/* Center content overlay — fades out as curtains open */}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, #2a0610 0%, #150308 45%, #0a0205 100%)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Particles />

            {/* Top Tamil tagline */}
            <motion.p
              className="font-body text-amber-300/60 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Since 1930s · NMP Group · Chidambaram
            </motion.p>

            {/* Mandala + store monogram */}
            <motion.div
              className="relative flex items-center justify-center mb-5 sm:mb-7"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <MandalRings />
              {/* Pulsing halo */}
              <motion.div
                className="absolute rounded-full border border-amber-400/20"
                style={{ width: 200, height: 200 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Store name */}
            <StoreNameReveal />

            {/* Subtitle */}
            <motion.p
              className="font-body text-amber-200/50 text-[10px] sm:text-xs tracking-[0.4em] uppercase mt-2 mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              Ready Mades
            </motion.p>

            {/* Gold divider */}
            <GoldLine />

            {/* Progress bar */}
            <div className="mt-5 sm:mt-6">
              <ProgressBar progress={progress} />
              <motion.p
                className="text-center font-body text-amber-300/40 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                {progress < 100 ? "Curating your experience…" : "Welcome ✦"}
              </motion.p>
            </div>

            {/* Tamil line at bottom */}
            <motion.p
              className="absolute bottom-8 font-cormorant text-amber-200/30 text-sm sm:text-base italic tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              ஸ்டைலும் பாரம்பரியமும் ஒன்றாக ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curtain panels — must outlive the center content to complete the reveal */}
      {showCurtains && <CurtainPanels exiting={exiting} />}
    </>
  );
}
