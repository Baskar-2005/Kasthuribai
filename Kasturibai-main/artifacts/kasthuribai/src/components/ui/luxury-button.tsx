import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-gold hover:bg-gold-light text-black font-semibold shadow-lg shadow-gold/25 hover:shadow-gold/40 border border-gold-light/50",
      secondary: "bg-primary text-primary-foreground hover:bg-primary/90 border border-border/50",
      outline: "border-2 border-gold text-gold hover:bg-gold hover:text-black",
      ghost: "hover:bg-accent/10 text-foreground",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-8 text-sm uppercase tracking-wider",
      lg: "h-14 px-10 text-base uppercase tracking-widest",
      icon: "h-11 w-11 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
LuxuryButton.displayName = "LuxuryButton";
