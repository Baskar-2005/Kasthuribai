import { memo } from "react";
import { SILVER_CATEGORIES } from "@/data/silver-mock-data";
import type { SilverCategoryTabsKey } from "./types";
import { cn } from "@/lib/utils";

/** Horizontal pill row used in mobile sticky bar */
export const SilverCategoryTabs = memo(function SilverCategoryTabs({
  value,
  onChange,
}: {
  value: SilverCategoryTabsKey;
  onChange: (next: SilverCategoryTabsKey) => void;
}) {
  const items: { key: SilverCategoryTabsKey; label: string; emoji: string }[] = [
    { key: "all", label: "All", emoji: "✦" },
    ...SILVER_CATEGORIES.map(c => ({ key: c.key as SilverCategoryTabsKey, label: c.title, emoji: c.emoji })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide px-1">
      {items.map(item => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-md"
                : "border-slate-200 bg-white/90 hover:bg-white hover:border-slate-300 text-slate-700"
            )}
          >
            <span className="text-[11px]">{item.emoji}</span>
            {item.label}
          </button>
        );
      })}
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
    <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
      {SILVER_CATEGORIES.map(cat => {
        const isActive = active === cat.key;
        const imgSrc = `/images/silver/${cat.folderName}/${cat.folderName}_1.jpg`;

        return (
          <button
            key={cat.key}
            onClick={() => onChange(isActive ? "all" : cat.key)}
            className={cn(
              "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 focus:outline-none",
              isActive
                ? "ring-2 ring-amber-400 ring-offset-2 shadow-xl"
                : "hover:shadow-lg hover:-translate-y-1"
            )}
          >
            {/* Image */}
            <div className="aspect-square relative">
              <img
                src={imgSrc}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => { (e.currentTarget as HTMLImageElement).src = "/images/silver/_fallback.jpg"; }}
              />
              {/* Dark gradient overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t transition-all duration-300",
                isActive
                  ? "from-amber-900/80 via-amber-900/30 to-transparent"
                  : "from-slate-900/70 via-slate-900/20 to-transparent group-hover:from-slate-900/75"
              )} />
              {/* Active check */}
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5"/><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                </div>
              )}
              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 p-1.5">
                <p className="text-white text-[9px] sm:text-[10px] font-bold leading-tight text-center drop-shadow-sm line-clamp-2">
                  {cat.title}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
});
