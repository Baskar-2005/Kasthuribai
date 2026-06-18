import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}
    >
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 border-r-purple-500 animate-spin" style={{ animationDuration: "1.5s" }} />
      
      {/* Middle ring with gradient */}
      <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-amber-400 border-l-rose-400 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
      
      {/* Inner pulsing dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 animate-pulse" />
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" style={{ animationDelay: "0s" }} />
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: "1s" }} />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-400/20 blur-sm animate-pulse" />
    </div>
  )
}

export { Spinner }
