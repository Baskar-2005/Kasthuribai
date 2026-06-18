import { memo } from "react";
import { SILVER_CATEGORIES } from "@/data/silver-mock-data";
import type { SilverCategoryTabsKey } from "./types";

const ITEM_LABEL = (key: SilverCategoryTabsKey) => {
  if (key === "all") return "All";
  const c = SILVER_CATEGORIES.find((x) => x.key === key);
  if (!c) return "All";
  // Requested labels: Anklets, Toe Rings, Chains, Rings, Bracelets, Bangles, Earrings, Pooja Collection, Gift Collection, Kids Silver Collection
  const t = c.title;
  if (t.toLowerCase().includes("anklets")) return "Silver Anklets";
  if (t.toLowerCase().includes("toe rings")) return "Silver Toe Rings";
  if (t.toLowerCase().includes("chains")) return "Silver Chains";
  if (t.toLowerCase().includes("rings")) return "Silver Rings";
  if (t.toLowerCase().includes("bracelets")) return "Silver Bracelets";
  if (t.toLowerCase().includes("bangles")) return "Silver Bangles";
  if (t.toLowerCase().includes("earrings")) return "Silver Earrings";
  if (t.toLowerCase().includes("pooja")) return "Silver Pooja Collection";
  if (t.toLowerCase().includes("gift")) return "Silver Gift Collection";
  if (t.toLowerCase().includes("kids")) return "Kids Silver Collection";
  return c.title;
};

export const SilverCategoryTabs = memo(function SilverCategoryTabs({
  value,
  onChange,
}: {
  value: SilverCategoryTabsKey;
  onChange: (next: SilverCategoryTabsKey) => void;
}) {
  const items: SilverCategoryTabsKey[] = ["all", ...SILVER_CATEGORIES.map((c) => c.key)];

  return (
    <div className="px-1">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {items.map((key) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={
                "shrink-0 rounded-full border px-4 py-2 text-xs font-body font-semibold transition " +
                (active
                  ? "border-slate-900 bg-slate-900 text-white shadow-md"
                  : "border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300 text-slate-900")
              }
            >
              {ITEM_LABEL(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
});

