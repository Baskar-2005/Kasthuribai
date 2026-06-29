---
name: Silver Corner architecture
description: Filtering pipeline, image conventions, WhatsApp env var, and availability/purity filter logic for the Silver Corner page.
---

## Image paths
Real images live at `/images/silver/<folderName>/<folderName>_1.jpg` through `_3.jpg` (3 per category).
`silver-mock-data.ts` now cycles through 1–3 using `categoryImg(folderName, variant)`. The `folderName` column in `SILVER_CATEGORIES` maps each category key to its folder (e.g. `toe_rings → metti`). All product `images` arrays now use these real paths, not generated seeds.

## Filtering
`filterSilverProducts` in `filtering.ts` handles query, price, weight, stock status, and category.
SilverCorner.tsx handles **purity multi-select** and **flag availability** (newArrivals / bestSellers) as post-processing steps on the result — these are not passed into filterSilverProducts.

**Why:** filterSilverProducts takes `purity: string | "all"` (single value). Multi-purity is applied as a Set filter after. newArrivals/bestSellers map to product flags (`isNewArrival`, `isBestSeller`), not `stockStatus`, so they can't go through the availability pipe.

## WhatsApp number
Both `SilverWhatsAppOrderButton` and `SilverProductCard` read `VITE_WHATSAPP_NUMBER` from Vite env, stripping non-digits, with fallback `"919876543210"`. Set this env var before deploying.

## Components structure
- `SilverCategoryTabs` — horizontal pill row (mobile sticky bar)
- `SilverCategoryGrid` — visual image card grid (body section, click to filter)
- `SilverFilterPanel` — desktop sidebar + mobile drawer content; uses button-style toggles not checkboxes
- `SilverMobileFilterDrawer` — wraps SilverFilterPanel; inner div is `overflow-y-auto px-4 py-4` for scrollability
- `SilverProductCard` — has keyboard semantics (role=button, tabIndex, onKeyDown) and hover WhatsApp/Quick View reveal
- `SilverProductDetailsModal` — no longer needs `renderWhatsApp` prop (now optional compat shim); uses `SilverWhatsAppOrderButton` directly; image nav buttons have `aria-label`
