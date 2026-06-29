import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, OrderStatus } from "@/store/use-orders";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock,
  RefreshCw, LogOut, ChevronDown, Search, User, Phone, Mail,
  MapPin, CreditCard, Calendar, AlertCircle, FlaskConical,
  Star, TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

// ── Admin token (change this to your secret) ─────────────────────────────
const ADMIN_TOKEN = "kasthuribai@admin";

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:          { label: "Pending",          color: "#d97706", bg: "rgba(217,119,6,0.1)",   icon: Clock        },
  confirmed:        { label: "Confirmed",        color: "#2563eb", bg: "rgba(37,99,235,0.1)",   icon: CheckCircle2 },
  processing:       { label: "Processing",       color: "#6d28d9", bg: "rgba(109,40,217,0.1)",  icon: RefreshCw    },
  shipped:          { label: "Shipped",          color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  icon: Truck        },
  out_for_delivery: { label: "Out for Delivery", color: "#ea580c", bg: "rgba(234,88,12,0.1)",   icon: Truck        },
  delivered:        { label: "Delivered",        color: "#16a34a", bg: "rgba(22,163,74,0.1)",   icon: Package      },
  cancelled:        { label: "Cancelled",        color: "#dc2626", bg: "rgba(220,38,38,0.1)",   icon: XCircle      },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

// ── Demo orders to pre-populate ───────────────────────────────────────────
const DEMO_ORDERS = [
  {
    id: `ORD-DEMO-001`,
    razorpayOrderId: "pay_demo_Qk9xZ3mVc",
    razorpayPaymentId: "pay_demo_Qk9xZ3mVc",
    customerName: "Karthik Rajan",
    customerEmail: "karthik@example.com",
    customerPhone: "9876543210",
    shippingAddress: "14, Nehru Street, Cuddalore - 607001, Tamil Nadu",
    totalAmount: 3299,
    status: "delivered" as OrderStatus,
    items: [
      { id: "p1", name: "Pure Cotton Formal Shirt", category: "Men", price: 799, quantity: 2, image: "", rating: 4.5, reviewCount: 128 },
      { id: "p2", name: "Embroidered Kurti Set", category: "Women", price: 899, quantity: 1, image: "", rating: 4.3, reviewCount: 74 },
    ],
    trackingSteps: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: `ORD-DEMO-002`,
    razorpayOrderId: "pay_demo_Lp7wYn2bAj",
    razorpayPaymentId: "pay_demo_Lp7wYn2bAj",
    customerName: "Meena Sundaram",
    customerEmail: "meena.s@gmail.com",
    customerPhone: "9444112233",
    shippingAddress: "7/3, Raja Nagar, Chidambaram - 608001, Tamil Nadu",
    totalAmount: 2499,
    status: "shipped" as OrderStatus,
    items: [
      { id: "p3", name: "Kanjeevaram Silk Saree", category: "Traditional", price: 2499, quantity: 1, image: "", rating: 4.8, reviewCount: 89 },
    ],
    trackingSteps: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `ORD-DEMO-003`,
    razorpayOrderId: "",
    razorpayPaymentId: null,
    customerName: "Selvam Murugan",
    customerEmail: "",
    customerPhone: "8012345678",
    shippingAddress: "22, Fishermen Colony, Cuddalore Port - 607003, Tamil Nadu",
    totalAmount: 1198,
    status: "confirmed" as OrderStatus,
    items: [
      { id: "p4", name: "Kids Essential T-shirt Pack", category: "Kids", price: 399, quantity: 3, image: "", rating: 4.6, reviewCount: 156 },
    ],
    trackingSteps: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `ORD-DEMO-004`,
    razorpayOrderId: "",
    razorpayPaymentId: null,
    customerName: "Priya Anand",
    customerEmail: "priya.a@outlook.com",
    customerPhone: "9500667788",
    shippingAddress: "5, Gandhi Road, Villupuram - 605602, Tamil Nadu",
    totalAmount: 1499,
    status: "pending" as OrderStatus,
    items: [
      { id: "p5", name: "Designer Georgette Saree", category: "Women", price: 1499, quantity: 1, image: "", rating: 4.2, reviewCount: 52 },
    ],
    trackingSteps: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `ORD-DEMO-005`,
    razorpayOrderId: "pay_demo_Cq2xJn9pFr",
    razorpayPaymentId: "pay_demo_Cq2xJn9pFr",
    customerName: "Ravi Kumar",
    customerEmail: "ravi.k@yahoo.com",
    customerPhone: "7299001122",
    shippingAddress: "88, Anna Salai, Chennai - 600002, Tamil Nadu",
    totalAmount: 5997,
    status: "processing" as OrderStatus,
    items: [
      { id: "p6", name: "Party Wear Evening Gown", category: "Festive", price: 1999, quantity: 3, image: "", rating: 4.4, reviewCount: 43 },
    ],
    trackingSteps: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function fmt(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_TOKEN) {
      sessionStorage.setItem("kb_admin_auth", "1");
      onLogin();
    } else {
      setError("Incorrect admin password. Try kasthuribai@admin");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, hsl(4,60%,10%) 0%, hsl(18,45%,12%) 100%)",
      fontFamily: "Poppins, system-ui, sans-serif", padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: 380, borderRadius: 24,
          background: "hsl(30,100%,98%)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          padding: "36px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "rgba(181,58,46,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShoppingBag size={26} color="hsl(4,60%,44%)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: "hsl(18,18%,14%)" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "hsl(25,38%,45%)" }}>Kasthuribai Ready Mades · Orders</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,45%)", display: "block", marginBottom: 6 }}>
              Admin Password
            </label>
            <input
              type="password" placeholder="Enter admin password"
              value={input} onChange={(e) => setInput(e.target.value)} required
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14,
                border: `1.5px solid ${error ? "hsl(0,84%,60%)" : "rgba(139,94,60,0.2)"}`,
                outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                color: "hsl(18,18%,14%)", background: "white",
              }}
            />
            {error && (
              <p style={{ fontSize: 12, color: "hsl(0,84%,50%)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={12} /> {error}
              </p>
            )}
          </div>
          <button type="submit" style={{
            padding: "13px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, hsl(4,65%,48%), hsl(4,60%,38%))",
            color: "#FFF9F0", fontWeight: 700, fontSize: 15, cursor: "pointer",
            fontFamily: "inherit", boxShadow: "0 6px 20px rgba(181,58,46,0.3)",
          }}>
            Sign In
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "hsl(25,38%,55%)", marginTop: 4 }}>
            <Link href="/" style={{ color: "hsl(4,60%,44%)", textDecoration: "none" }}>← Back to Store</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { orders, addOrder, updateOrderStatus } = useOrders();

  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("kb_admin_auth") === "1");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  function handleLogin() { setLoggedIn(true); }
  function logout() { sessionStorage.removeItem("kb_admin_auth"); setLoggedIn(false); }

  async function seedDemo() {
    setSeeding(true);
    for (const demo of DEMO_ORDERS) {
      if (!orders.find((o) => o.id === demo.id)) {
        // @ts-ignore – demo items match CartItem shape closely enough
        addOrder(demo as any);
      }
    }
    setLastRefreshed(new Date());
    await new Promise((r) => setTimeout(r, 600));
    setSeeding(false);
  }

  function handleUpdateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    updateOrderStatus(orderId, status);
    setTimeout(() => setUpdatingId(null), 400);
  }

  // ── Stats ──
  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped:   orders.filter((o) => ["shipped", "out_for_delivery"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue:   orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0),
  }), [orders]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      const matchSearch = !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.razorpayPaymentId || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, search, filterStatus]);

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  // ─── Dashboard UI ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "hsl(30,60%,96%)", fontFamily: "Poppins, system-ui, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "hsl(4,60%,12%)", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(255,249,240,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShoppingBag size={18} color="#FFF9F0" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#FFF9F0", lineHeight: 1 }}>Kasthuribai</p>
            <p style={{ fontSize: 11, color: "rgba(255,249,240,0.45)", marginTop: 2 }}>Admin Dashboard</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
          <p style={{ fontSize: 11, color: "rgba(255,249,240,0.35)", marginRight: 4 }}>
            Updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>

          <button onClick={seedDemo} disabled={seeding}
            style={{
              padding: "7px 14px", borderRadius: 10, border: "none",
              cursor: seeding ? "not-allowed" : "pointer",
              background: "rgba(124,58,237,0.25)", color: "#c4b5fd",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              opacity: seeding ? 0.7 : 1,
            }}>
            <FlaskConical size={13} />
            {seeding ? "Seeding…" : "Load Demo"}
          </button>

          <button onClick={() => setLastRefreshed(new Date())}
            style={{
              padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "rgba(255,249,240,0.1)", color: "#FFF9F0",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}>
            <RefreshCw size={13} />
            Refresh
          </button>

          <button onClick={logout}
            style={{
              padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "rgba(220,38,38,0.15)", color: "#fca5a5",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Orders", value: stats.total,     color: "#1e40af", bg: "rgba(30,64,175,0.08)",   icon: ShoppingBag  },
            { label: "Pending",      value: stats.pending,   color: "#d97706", bg: "rgba(217,119,6,0.08)",   icon: Clock        },
            { label: "Confirmed",    value: stats.confirmed, color: "#2563eb", bg: "rgba(37,99,235,0.08)",   icon: CheckCircle2 },
            { label: "Shipped",      value: stats.shipped,   color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  icon: Truck        },
            { label: "Delivered",    value: stats.delivered, color: "#16a34a", bg: "rgba(22,163,74,0.08)",   icon: Package      },
            { label: "Revenue",      value: stats.revenue > 0 ? `₹${stats.revenue.toLocaleString("en-IN")}` : "₹0",
              color: "hsl(4,60%,44%)", bg: "rgba(181,58,46,0.08)", icon: TrendingUp },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                borderRadius: 16, padding: "16px 18px",
                background: "hsl(30,100%,98%)",
                border: "1px solid rgba(139,94,60,0.1)",
                boxShadow: "0 2px 8px rgba(139,94,60,0.06)",
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)" }}>
                  {s.label}
                </p>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={15} color={s.color} />
                </div>
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const, marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "hsl(25,38%,50%)" }} />
            <input
              placeholder="Search orders, customers, payment IDs…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                borderRadius: 12, border: "1.5px solid rgba(139,94,60,0.15)",
                fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                background: "hsl(30,100%,98%)", color: "hsl(18,18%,14%)",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {(["all", ...ALL_STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s as OrderStatus | "all")}
                style={{
                  padding: "7px 14px", borderRadius: 10, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                  border: filterStatus === s ? "none" : "1px solid rgba(139,94,60,0.15)",
                  background: filterStatus === s ? "hsl(4,60%,44%)" : "hsl(30,100%,98%)",
                  color: filterStatus === s ? "#FFF9F0" : "hsl(25,38%,45%)",
                }}>
                {s === "all" ? "All" : STATUS_CONFIG[s as OrderStatus].label}
                {s !== "all" && ` (${orders.filter((o) => o.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            background: "hsl(30,100%,98%)", borderRadius: 20,
            border: "1px solid rgba(139,94,60,0.1)",
          }}>
            <ShoppingBag size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.2 }} />
            <p style={{ fontWeight: 700, fontSize: 16, color: "hsl(18,18%,20%)", marginBottom: 6 }}>
              {orders.length === 0 ? "No orders yet" : "No orders match your filter"}
            </p>
            <p style={{ fontSize: 13, color: "hsl(25,38%,50%)", marginBottom: orders.length === 0 ? 20 : 0 }}>
              {orders.length === 0
                ? "Orders will appear here once customers check out."
                : "Try adjusting your search or filter."}
            </p>
            {orders.length === 0 && (
              <button onClick={seedDemo} disabled={seeding}
                style={{
                  margin: "0 auto", display: "flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg, hsl(258,60%,54%), hsl(258,60%,44%))",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: seeding ? "not-allowed" : "pointer",
                  fontFamily: "inherit", boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
                  opacity: seeding ? 0.7 : 1,
                }}>
                <FlaskConical size={16} />
                {seeding ? "Loading demo orders…" : "Load Demo Orders"}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 12, color: "hsl(25,38%,50%)", marginBottom: 4 }}>
              Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>

            {filtered.map((order, i) => {
              const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = sc.icon;
              const isExpanded = expandedId === order.id;

              return (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    borderRadius: 18, overflow: "hidden",
                    background: "hsl(30,100%,98%)",
                    border: `1px solid ${isExpanded ? "rgba(181,58,46,0.25)" : "rgba(139,94,60,0.1)"}`,
                    boxShadow: isExpanded ? "0 4px 20px rgba(181,58,46,0.1)" : "0 2px 8px rgba(139,94,60,0.05)",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}>

                  {/* ── Row header (click to expand) ── */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer", flexWrap: "wrap" as const }}>

                    {/* Order ID + date */}
                    <div style={{ minWidth: 140 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "hsl(4,60%,44%)", marginBottom: 2 }}>
                        #{order.id.slice(-10).toUpperCase()}
                      </p>
                      <p style={{ fontSize: 11, color: "hsl(25,38%,50%)" }}>
                        <Calendar size={10} style={{ display: "inline", marginRight: 3 }} />
                        {fmt(order.createdAt)}
                      </p>
                    </div>

                    {/* Customer */}
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "hsl(18,18%,14%)", marginBottom: 2 }}>
                        {order.customerName}
                      </p>
                      <p style={{ fontSize: 11, color: "hsl(25,38%,50%)" }}>
                        {order.customerPhone}
                        {order.customerEmail && ` · ${order.customerEmail}`}
                      </p>
                    </div>

                    {/* Items summary */}
                    <div style={{ minWidth: 100 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(18,18%,20%)", marginBottom: 2 }}>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <p style={{ fontSize: 11, color: "hsl(25,38%,50%)", whiteSpace: "nowrap" }}>
                        {order.items.map((it) => it.name.split(" ")[0]).slice(0, 2).join(", ")}
                        {order.items.length > 2 && "…"}
                      </p>
                    </div>

                    {/* Total */}
                    <p style={{ fontSize: 16, fontWeight: 800, color: "hsl(4,60%,44%)", minWidth: 80, textAlign: "right" as const }}>
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>

                    {/* Status badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: sc.bg }}>
                      <StatusIcon size={12} color={sc.color} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{sc.label}</span>
                    </div>

                    {/* Chevron */}
                    <ChevronDown size={16} color="hsl(25,38%,55%)"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </div>

                  {/* ── Expanded detail ── */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{
                          borderTop: "1px solid rgba(139,94,60,0.1)", padding: "18px 20px",
                          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20,
                        }}>
                          {/* Customer info */}
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 12 }}>
                              Customer Details
                            </p>
                            {[
                              { icon: User,       text: order.customerName },
                              { icon: Phone,      text: order.customerPhone },
                              ...(order.customerEmail ? [{ icon: Mail, text: order.customerEmail }] : []),
                              { icon: MapPin,     text: order.shippingAddress },
                              ...(order.razorpayPaymentId ? [{ icon: CreditCard, text: order.razorpayPaymentId, mono: true }] : []),
                            ].map((row, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                                <row.icon size={13} color="hsl(25,38%,55%)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: 13, color: "hsl(18,18%,20%)", fontFamily: row.mono ? "monospace" : "inherit", wordBreak: "break-all" as const }}>
                                  {row.text}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order items */}
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 12 }}>
                              Order Items
                            </p>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 }}>
                                <div>
                                  <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(18,18%,14%)" }}>{item.name}</p>
                                  <p style={{ fontSize: 11, color: "hsl(25,38%,55%)" }}>
                                    {item.category} · Qty {item.quantity}
                                    {item.quantity > 1 && ` · ${formatPrice(item.price)} each`}
                                  </p>
                                </div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "hsl(4,60%,44%)", whiteSpace: "nowrap" as const }}>
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </p>
                              </div>
                            ))}
                            <div style={{ borderTop: "1px solid rgba(139,94,60,0.12)", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
                              <span style={{ fontSize: 15, fontWeight: 800, color: "hsl(4,60%,44%)" }}>
                                ₹{order.totalAmount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          {/* Update status */}
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 12 }}>
                              Update Status
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {ALL_STATUSES.map((s) => {
                                const cfg = STATUS_CONFIG[s];
                                const Icon = cfg.icon;
                                const isCurrent = order.status === s;
                                return (
                                  <button key={s}
                                    disabled={isCurrent || updatingId === order.id}
                                    onClick={() => handleUpdateStatus(order.id, s)}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 8,
                                      padding: "9px 14px", borderRadius: 12, border: "none",
                                      cursor: isCurrent ? "default" : "pointer",
                                      background: isCurrent ? cfg.bg : "rgba(139,94,60,0.04)",
                                      fontFamily: "inherit", transition: "background 0.15s",
                                      opacity: updatingId === order.id && !isCurrent ? 0.5 : 1,
                                    }}>
                                    <Icon size={13} color={isCurrent ? cfg.color : "hsl(25,38%,55%)"} />
                                    <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? cfg.color : "hsl(25,38%,45%)" }}>
                                      {cfg.label}
                                    </span>
                                    {isCurrent && (
                                      <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: cfg.color }}>● CURRENT</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
