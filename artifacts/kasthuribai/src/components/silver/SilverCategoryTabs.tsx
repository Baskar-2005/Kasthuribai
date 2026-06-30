import { memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SILVER_CATEGORIES } from "@/data/silver-mock-data";
import type { SilverCategoryTabsKey } from "./types";
import { cn } from "@/lib/utils";

const TABS: { key: SilverCategoryTabsKey; label: string; emoji: string }[] = [
  { key: "all", label: "All Silver", emoji: "✦" },
  ...SILVER_CATEGORIES.map(c => ({ key: c.key as SilverCategoryTabsKey, label: c.title, emoji: c.emoji })),
];

export const SilverCategoryTabs = memo(function SilverCategoryTabs({
  value,
  onChange,
}: {
  value: SilverCategoryTabsKey;
  onChange: (next: SilverCategoryTabsKey) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>("[data-active='true']");
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [value]);

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />

      <div
        ref={ref}
        className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide px-2 cursor-grab active:cursor-grabbing select-none py-1"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map(item => {
          const active = value === item.key;
          return (
            <motion.button
              key={item.key}
              data-active={active}
              type="button"
              onClick={() => onChange(item.key)}
              whileTap={{ scale: 0.95 }}
              whileHover={!active ? { y: -1 } : {}}
              className={cn(
                "relative shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap overflow-hidden border",
                active
                  ? "text-white border-transparent shadow-xl shadow-slate-900/25"
                  : "border-slate-200 bg-white/90 text-slate-500 hover:border-slate-400 hover:text-slate-800 hover:bg-white"
              )}
            >
              {/* Animated dark background */}
              {active && (
                <motion.span
                  layoutId="silver-tab-pill"
                  className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {/* Shimmer sweep on active */}
              {active && (
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/8 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
              )}

              {/* Emoji */}
              <span className="relative z-10 text-sm leading-none">{item.emoji}</span>

              {/* Label */}
              <span className="relative z-10 tracking-wide">{item.label}</span>

              {/* Gold dot indicator */}
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

/** Visual category card grid shown in the page body */
export const SilverCategoryGrid = memo(function SilverCategoryGrid({
  active,
  onChange,
}: {
  active: SilverCategoryTabsKey;
  onChange: (next: SilverCategoryTabsKey) => void;
}) {
  return (
    <div className="grid grid-cols-5 lg:grid-cols-10 gap-2.5">
      {SILVER_CATEGORIES.map(cat => {
        const isActive = active === cat.key;
        const imgSrc = `/images/silver/${cat.folderName}/${cat.folderName}_1.png`;

        return (
          <motion.button
            key={cat.key}
            onClick={() => onChange(isActive ? "all" : cat.key)}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "group relative rounded-2xl overflow-hidden text-left focus:outline-none transition-shadow duration-300",
              isActive
                ? "ring-2 ring-amber-400 ring-offset-2 shadow-xl shadow-amber-100"
                : "shadow-sm hover:shadow-lg"
            )}
          >
            <div className="aspect-square relative">
              <img
                src={imgSrc}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => { (e.currentTarget as HTMLImageElement).src = "/images/silver/_fallback.jpg"; }}
              />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t transition-all duration-300",
                isActive
                  ? "from-amber-900/80 via-amber-900/20 to-transparent"
                  : "from-slate-900/70 via-slate-900/15 to-transparent group-hover:from-slate-900/75"
              )} />

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md"
                >
                  <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                </motion.div>
              )}

              <div className="absolute bottom-0 inset-x-0 p-1.5">
                <p className="text-white text-[9px] sm:text-[10px] font-bold leading-tight text-center drop-shadow-sm line-clamp-2">
                  {cat.title}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
});
