---
name: Admin Dashboard
description: How the admin dashboard is built and secured, and the admin password.
---

The admin dashboard lives at `/admin` in the kasthuribai frontend artifact.

**Auth**: Simple sessionStorage flag `kb_admin_auth=1`. Password hardcoded as `kasthuribai@admin` in `ADMIN_TOKEN` constant at top of `AdminDashboard.tsx`. No backend auth — purely client-side.

**Data source**: Reads from Zustand `useOrders` store (persisted in localStorage as `kasthuribai-orders`). Not wired to the API server. Orders land here when CartDrawer checkout completes and calls `addOrder()`.

**Why Zustand not API**: The API server has no `/api/orders` endpoint. Orders are created client-side via Zustand+persist. Admin dashboard reads the same store.

**How to apply**: If you ever add a real backend orders DB, wire `addOrder` to POST to API and fetch orders in admin via `useEffect`. The UI is already designed for live-refresh patterns.

**Demo orders**: "Load Demo" button in the top bar calls `seedDemo()` which pushes 5 pre-built demo orders into the store for testing.
