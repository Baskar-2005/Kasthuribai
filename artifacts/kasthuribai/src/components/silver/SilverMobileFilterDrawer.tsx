import { useEffect } from "react";
import { X } from "lucide-react";

import type { SilverFilterPanelState } from "./types";
import { SilverFilterPanel } from "./SilverFilterPanel";

export function SilverMobileFilterDrawer({
  open,
  onClose,
  state,
  setState,
  purityOptions,
  weightMinMax,
  resultsCount,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  state: SilverFilterPanelState;
  setState: (next: SilverFilterPanelState) => void;
  purityOptions: string[];
  weightMinMax: { min: number; max: number };
  resultsCount: number;
  onClearAll: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          "fixed inset-0 bg-black/40 z-[60] transition-opacity duration-200 md:hidden " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <div
        className={
          "fixed top-0 right-0 h-screen w-[88vw] max-w-[420px] z-[70] transition-transform duration-200 md:hidden " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="h-full bg-background border-l border-slate-200 shadow-2xl">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-body font-bold text-slate-700 uppercase tracking-widest">Filters</div>
              <div className="text-sm font-body font-bold text-slate-900">Refine your results</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white/70 hover:bg-white flex items-center justify-center"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[calc(100vh-60px)] overflow-hidden">
            <SilverFilterPanel
              state={state}
              setState={setState}
              purityOptions={purityOptions}
              weightMinMax={weightMinMax}
              resultsCount={resultsCount}
              onClearAll={onClearAll}
            />
          </div>
        </div>
      </div>
    </>
  );
}

