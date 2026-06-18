import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FilterPanel, FilterState } from "./sections/FilterPanel";
import { Color, Subcategory, Style } from "@/data/mock-data";


interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableSubcategories?: Subcategory[];
  availableColors?: Color[];
  availableSizes?: string[];
  availableStyles?: Style[];
}

export function MobileFilterDrawer({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange,
  availableSubcategories = [],
  availableColors = [],
  availableSizes = [],
  availableStyles = []
}: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9998]"
            onClick={onClose}
          />
          {/* Drawer from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-[10000] shadow-2xl border-l"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Filters</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <FilterPanel
                  filters={filters}
                  onFilterChange={onFilterChange}
                  availableSubcategories={availableSubcategories}
                  availableColors={availableColors}
                  availableSizes={availableSizes}
                  availableStyles={availableStyles}
                  showAgeFilter={false}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
