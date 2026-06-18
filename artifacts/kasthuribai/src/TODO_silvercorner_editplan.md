# Silver Corner UX refactor plan

## Information gathered
- `src/pages/SilverCorner.tsx` currently renders:
  - A large top “premium header panel” containing a `SilverFiltersBar` (which itself includes **category cards**).
  - A second “Kids-style panel” where the **left sidebar** repeats the search + `SilverFiltersBar`, and the right side shows a category **grid of big cards**.
- `src/components/silver/SilverFiltersBar.tsx` is responsible for:
  - Search input + its own “Silver Categories” grid (card-based category selection).
  - A dynamic accordion with category-specific filter UI.
- `src/data/silver-mock-data.ts` defines:
  - 10 categories: `anklets, toe_rings, chains, rings, bracelets, bangles, earrings, pooja, gifts, kids`.

## Plan
### 1) Create a dedicated “Category Pills” row (top horizontal bar)
- Add a small component inside `SilverCorner.tsx` (or new file) that renders the requested pills/chips mapping:
  - All, Anklets, Metti, Chains, Rings, Bracelets, Bangles, Earrings, Pooja, Gifts, Kids.
- Clicking a pill sets `activeCategory` and resets pagination/search inputs as needed.

### 2) Make `Left Sidebar = Filters Only`
- Modify `SilverFiltersBar.tsx` to support a mode like `variant: 'filtersOnly' | 'full'`.
- In `filtersOnly` mode:
  - Hide the category cards section.
  - Keep search + core filters (price range, purity, weight range, availability).
  - Keep the dynamic accordion section for category-specific filters.

### 3) Remove category cards / reduce vertical space
- Update `SilverCorner.tsx`:
  - Remove the category grid of big cards currently shown in the right content area.
  - Remove the duplicate filter panel at the top-right that currently burns space.
  - Keep one clean layout section: Category pills row on top, then a two-column layout.

### 4) Follow Women/Men/Kids UX pattern
- Implement this hierarchy in `SilverCorner.tsx`:
  - Top: Category pills row.
  - Body: left sticky filter sidebar (filters only) + right product grid.
  - Ensure minimal scrolling before filters/products are visible.

### 5) Dynamic filters based on selected category
- Ensure the dynamic accordion title and category-specific options update when `activeCategory` changes.
- Use the existing `SilverFiltersBar` logic; just hide the category selection UI.

### 6) Mobile responsiveness
- On small screens:
  - Category pills row remains horizontally scrollable.
  - Filters sidebar becomes a collapsible panel (simple conditional rendering) OR stays above products.

## Dependent files to edit
- `artifacts/kasthuribai/src/pages/SilverCorner.tsx`
- `artifacts/kasthuribai/src/components/silver/SilverFiltersBar.tsx`
- (optional) new component file for pills

## Followup steps
- Run `pnpm -C artifacts/kasthuribai dev` and verify Silver Corner.
- If TS errors appear, fix types for the new `variant` prop.

## Acceptance criteria
- No category card grid in sidebar/top.
- Category selection appears only as a top horizontal pills row.
- Left sidebar contains filters only.
- Layout matches “collection page” pattern: categories on top, filters left, products right.

