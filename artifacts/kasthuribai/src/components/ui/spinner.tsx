import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeMap = {
    sm: { outer: "w-10 h-10", text: "text-[8px]", dot: "w-1 h-1" },
    md: { outer: "w-16 h-16", text: "text-[10px]", dot: "w-1.5 h-1.5" },
    lg: { outer: "w-24 h-24", text: "text-[12px]", dot: "w-2 h-2" },
  }
  const s = sizeMap[size]

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative inline-flex items-center justify-center", s.outer, className)}
    >
      {/* Outermost slow gold ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: "#B8860B",
          borderRightColor: "#DAA520",
          animationDuration: "3s",
          animationTimingFunction: "linear",
        }}
      />

      {/* Mid ring — opposite spin, rose/maroon */}
      <div
        className="absolute inset-[6px] rounded-full border-2 border-transparent animate-spin"
        style={{
          borderBottomColor: "#9B1B30",
          borderLeftColor: "#C0392B",
          animationDuration: "2s",
          animationTimingFunction: "linear",
          animationDirection: "reverse",
        }}
      />

      {/* Inner ring — fast gold */}
      <div
        className="absolute inset-[13px] rounded-full border-[1.5px] border-transparent animate-spin"
        style={{
          borderTopColor: "#FFD700",
          borderRightColor: "transparent",
          animationDuration: "1s",
          animationTimingFunction: "linear",
        }}
      />

      {/* Centre — K monogram */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        <span
          className={cn("font-serif font-bold select-none", s.text)}
          style={{
            background: "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.05em",
          }}
        >
          K
        </span>
      </div>

      {/* Orbiting gold dot */}
      <div
        className={cn("absolute rounded-full animate-spin", s.dot)}
        style={{
          top: "2px",
          left: "50%",
          transformOrigin: "50% calc(50% + 10px)",
          background: "radial-gradient(circle, #FFD700, #B8860B)",
          boxShadow: "0 0 6px 2px rgba(218,165,32,0.7)",
          animationDuration: "1.4s",
          animationTimingFunction: "linear",
        }}
      />

      {/* Orbiting maroon dot — offset 180° */}
      <div
        className={cn("absolute rounded-full animate-spin", s.dot)}
        style={{
          bottom: "2px",
          left: "50%",
          transformOrigin: "50% calc(-50% - 10px)",
          background: "radial-gradient(circle, #C0392B, #9B1B30)",
          boxShadow: "0 0 6px 2px rgba(155,27,48,0.7)",
          animationDuration: "1.4s",
          animationTimingFunction: "linear",
        }}
      />

      {/* Soft glow halo */}
      <div
        className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(218,165,32,0.18) 0%, rgba(155,27,48,0.08) 60%, transparent 80%)",
          animationDuration: "2s",
        }}
      />
    </div>
  )
}

export { Spinner }
