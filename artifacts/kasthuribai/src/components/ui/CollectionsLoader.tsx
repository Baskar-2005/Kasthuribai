import { motion } from "framer-motion";

const DOTS = 8;

export function CollectionsLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1a0a0a 0%, #2d0e0e 40%, #1c0707 100%)" }}
    >
      {/* Ambient bokeh blobs */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          top: "10%", left: "15%",
          background: "radial-gradient(circle, rgba(184,134,11,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          bottom: "10%", right: "10%",
          background: "radial-gradient(circle, rgba(155,27,48,0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "pulse 3.5s ease-in-out infinite 1s",
        }}
      />

      {/* Jewel orbit ring */}
      <div className="absolute" style={{ width: 340, height: 340 }}>
        {Array.from({ length: DOTS }).map((_, i) => {
          const angle = (i / DOTS) * 360;
          const delay = (i / DOTS) * -3;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: 8, height: 8,
                marginTop: -4, marginLeft: -4,
                transformOrigin: "4px 174px",
                transform: `rotate(${angle}deg)`,
                animation: `spin-cw 4s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <div
                style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: i % 2 === 0
                    ? "radial-gradient(circle, #FFD700, #B8860B)"
                    : "radial-gradient(circle, #ff8fa3, #9B1B30)",
                  boxShadow: i % 2 === 0
                    ? "0 0 8px 3px rgba(218,165,32,0.8)"
                    : "0 0 8px 3px rgba(155,27,48,0.8)",
                  animation: `counter-spin 4s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Outer decorative ring — slow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280, height: 280,
          border: "1px solid rgba(218,165,32,0.25)",
          animation: "spin-cw 12s linear infinite",
        }}
      />

      {/* Middle ring — reverse */}
      <div
        className="absolute rounded-full"
        style={{
          width: 220, height: 220,
          border: "1px dashed rgba(218,165,32,0.18)",
          animation: "spin-ccw 8s linear infinite",
        }}
      />

      {/* Inner glowing ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160, height: 160,
          border: "1.5px solid rgba(218,165,32,0.4)",
          boxShadow: "0 0 20px 4px rgba(218,165,32,0.15), inset 0 0 20px 4px rgba(218,165,32,0.08)",
          animation: "pulse-border 2.5s ease-in-out infinite",
        }}
      />

      {/* Diamond lotus SVG */}
      <div className="absolute" style={{ width: 100, height: 100 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Outer diamond */}
          <motion.polygon
            points="50,8 92,50 50,92 8,50"
            fill="none"
            stroke="#DAA520"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          {/* Inner diamond */}
          <motion.polygon
            points="50,22 78,50 50,78 22,50"
            fill="none"
            stroke="#FFD700"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
          {/* Cross lines */}
          <motion.line x1="50" y1="8" x2="50" y2="92"
            stroke="#DAA520" strokeWidth="0.4" opacity="0.3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          <motion.line x1="8" y1="50" x2="92" y2="50"
            stroke="#DAA520" strokeWidth="0.4" opacity="0.3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          {/* Centre jewel */}
          <motion.circle
            cx="50" cy="50" r="5"
            fill="none" stroke="#FFD700" strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          />
          <motion.circle
            cx="50" cy="50" r="3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            style={{ fill: "#FFD700" }}
          />
        </svg>
      </div>

      {/* Brand text block — below the ring */}
      <div className="relative mt-52 text-center select-none">
        {/* Main brand name — letter-by-letter reveal */}
        <div className="flex items-center justify-center gap-[0.12em] mb-1">
          {"KASTHURIBAI".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: "easeOut" }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                background: "linear-gradient(135deg, #B8860B 0%, #FFD700 45%, #DAA520 70%, #B8860B 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer-text 3s linear infinite",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Divider with diamonds */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <div style={{ height: 1, width: 40, background: "linear-gradient(to right, transparent, #B8860B)" }} />
          <span style={{ color: "#DAA520", fontSize: 10 }}>◆</span>
          <div style={{ height: 1, width: 40, background: "linear-gradient(to left, transparent, #B8860B)" }} />
        </motion.div>

        {/* Sub-tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            color: "#DAA520",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}
        >
          COMPANY · NMP READYMADES
        </motion.p>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-10 overflow-hidden rounded-full"
        style={{ width: 160, height: 2, background: "rgba(218,165,32,0.15)" }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(to right, #B8860B, #FFD700, #DAA520)",
            boxShadow: "0 0 8px 2px rgba(218,165,32,0.6)",
          }}
        />
      </motion.div>

      {/* "Loading collections" text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.4, 0] }}
        transition={{ duration: 1.4, times: [0, 0.2, 0.8, 1], repeat: Infinity }}
        className="absolute bottom-14"
        style={{ color: "rgba(218,165,32,0.5)", fontSize: "0.65rem", letterSpacing: "0.25em", fontFamily: "sans-serif" }}
      >
        LOADING COLLECTIONS
      </motion.p>

      {/* Keyframe injection */}
      <style>{`
        @keyframes spin-cw {
          from { transform: rotate(var(--start-angle, 0deg)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(218,165,32,0.15), inset 0 0 20px 4px rgba(218,165,32,0.08); }
          50%       { box-shadow: 0 0 35px 10px rgba(218,165,32,0.30), inset 0 0 30px 8px rgba(218,165,32,0.15); }
        }
        @keyframes shimmer-text {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </motion.div>
  );
}
