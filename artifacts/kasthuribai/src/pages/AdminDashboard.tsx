import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, OrderStatus } from "@/store/use-orders";
import { useIssues, IssueStatus } from "@/store/use-issues";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock,
  RefreshCw, LogOut, ChevronDown, Search, User, Phone, Mail,
  MapPin, CreditCard, Calendar, AlertCircle, Star, TrendingUp,
  RotateCcw, Banknote, Edit3, Save, X, Bell, MessageSquare,
  CheckCircle, ChevronRight, Filter,
} from "lucide-react";
import { Link } from "wouter";

const ADMIN_TOKEN = "kasthuribai@admin";

// ─── Status config (full set) ─────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:          { label: "Pending",          color: "#d97706", bg: "rgba(217,119,6,0.1)",   icon: Clock        },
  confirmed:        { label: "Confirmed",        color: "#2563eb", bg: "rgba(37,99,235,0.1)",   icon: CheckCircle2 },
  processing:       { label: "Processing",       color: "#6d28d9", bg: "rgba(109,40,217,0.1)",  icon: RefreshCw    },
  shipped:          { label: "Shipped",          color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  icon: Truck        },
  out_for_delivery: { label: "Out for Delivery", color: "#ea580c", bg: "rgba(234,88,12,0.1)",   icon: Truck        },
  delivered:        { label: "Delivered",        color: "#16a34a", bg: "rgba(22,163,74,0.1)",   icon: Package      },
  cancelled:        { label: "Cancelled",        color: "#dc2626", bg: "rgba(220,38,38,0.1)",   icon: XCircle      },
  returned:         { label: "Returned",         color: "#be123c", bg: "rgba(190,18,60,0.1)",   icon: RotateCcw    },
  refunded:         { label: "Refunded",         color: "#0d9488", bg: "rgba(13,148,136,0.1)",  icon: Banknote     },
};

const ISSUE_STATUS_CFG: Record<IssueStatus, { label: string; color: string; bg: string }> = {
  open:        { label: "Open",        color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  in_progress: { label: "In Progress", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  resolved:    { label: "Resolved",    color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  closed:      { label: "Closed",      color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_TOKEN) { sessionStorage.setItem("kb_admin_auth", "1"); onLogin(); }
    else setError("Incorrect password. Try kasthuribai@admin");
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,hsl(4,60%,10%) 0%,hsl(18,45%,12%) 100%)", fontFamily: "Poppins,system-ui,sans-serif", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 380, borderRadius: 24, background: "hsl(30,100%,98%)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", padding: "36px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px", background: "rgba(181,58,46,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={26} color="hsl(4,60%,44%)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: "hsl(18,18%,14%)" }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "hsl(25,38%,45%)" }}>Kasthuribai Ready Mades</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,45%)", display: "block", marginBottom: 6 }}>Admin Password</label>
            <input type="password" placeholder="Enter admin password" value={input} onChange={e => setInput(e.target.value)} required
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14, border: `1.5px solid ${error ? "hsl(0,84%,60%)" : "rgba(139,94,60,0.2)"}`, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", color: "hsl(18,18%,14%)", background: "white" }} />
            {error && <p style={{ fontSize: 12, color: "hsl(0,84%,50%)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} />{error}</p>}
          </div>
          <button type="submit" style={{ padding: 13, borderRadius: 14, border: "none", background: "linear-gradient(135deg,hsl(4,65%,48%),hsl(4,60%,38%))", color: "#FFF9F0", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(181,58,46,0.3)" }}>
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

// ─── Edit Details Modal ────────────────────────────────────────────────────────
function EditDetailsModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { orders, updateOrderDetails } = useOrders();
  const order = orders.find(o => o.id === orderId);
  const [form, setForm] = useState({
    courier: order?.courier ?? "",
    trackingId: order?.trackingId ?? "",
    currentLocation: order?.currentLocation ?? "",
    currentHub: order?.currentHub ?? "",
    estimatedDelivery: order?.estimatedDelivery ?? "",
    deliveryAgent: order?.deliveryAgent ?? "",
    deliveryAgentPhone: order?.deliveryAgentPhone ?? "",
    notes: order?.notes ?? "",
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateOrderDetails(orderId, form);
    setSaved(true);
    setTimeout(onClose, 900);
  }

  if (!order) return null;
  const F = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(25,38%,50%)", display: "block", marginBottom: 4 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid rgba(139,94,60,0.2)", fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        style={{ position: "relative", background: "hsl(30,100%,98%)", borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", fontFamily: "Poppins,system-ui,sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(139,94,60,0.1)" }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "hsl(18,18%,14%)" }}>Edit Order #{order.orderNumber}</p>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: "rgba(139,94,60,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="hsl(25,38%,50%)" />
          </button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 4 }}>Shipment Details</p>
          {F("Courier Partner", "courier")}
          {F("Tracking ID", "trackingId")}
          {F("Current Location", "currentLocation")}
          {F("Current Hub", "currentHub")}
          {F("Estimated Delivery", "estimatedDelivery", "date")}
          {F("Delivery Agent", "deliveryAgent")}
          {F("Agent Phone", "deliveryAgentPhone", "tel")}
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginTop: 4 }}>Notes</p>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid rgba(139,94,60,0.2)", fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" as const }} placeholder="Internal notes or customer instructions…" />
          <button onClick={handleSave}
            style={{ padding: "12px", borderRadius: 14, border: "none", background: saved ? "#16a34a" : "linear-gradient(135deg,hsl(4,65%,48%),hsl(4,60%,38%))", color: "#FFF9F0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }}>
            {saved ? <><CheckCircle size={16} />Saved!</> : <><Save size={16} />Save Changes</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Issue Reply Modal ─────────────────────────────────────────────────────────
function IssueReplyModal({ issueId, onClose }: { issueId: string; onClose: () => void }) {
  const { issues, replyToIssue, updateIssueStatus } = useIssues();
  const issue = issues.find(i => i.id === issueId);
  const [reply, setReply] = useState(issue?.adminReply ?? "");
  const [status, setStatus] = useState<IssueStatus>(issue?.status ?? "open");
  const [saved, setSaved] = useState(false);

  if (!issue) return null;

  function handleSave() {
    replyToIssue(issueId, reply, status);
    setSaved(true);
    setTimeout(onClose, 800);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ position: "relative", background: "hsl(30,100%,98%)", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", fontFamily: "Poppins,system-ui,sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(139,94,60,0.1)" }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "hsl(18,18%,14%)" }}>Respond to Issue</p>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: "rgba(139,94,60,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="hsl(25,38%,50%)" />
          </button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Issue summary */}
          <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>{issue.issueType}</p>
            <p style={{ fontSize: 13, color: "hsl(18,18%,20%)" }}>{issue.description}</p>
            <p style={{ fontSize: 11, color: "hsl(25,38%,55%)", marginTop: 6 }}>
              {issue.customerName} · Order #{issue.orderNumber} · {new Date(issue.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(25,38%,50%)", display: "block", marginBottom: 6 }}>Update Status</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {(["open","in_progress","resolved","closed"] as IssueStatus[]).map(s => {
                const cfg = ISSUE_STATUS_CFG[s];
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    style={{ padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: status === s ? cfg.bg : "rgba(139,94,60,0.04)", color: status === s ? cfg.color : "hsl(25,38%,50%)" }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reply */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(25,38%,50%)", display: "block", marginBottom: 6 }}>Reply to Customer</label>
            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid rgba(139,94,60,0.2)", fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" as const }}
              placeholder="Write a helpful response for the customer…" />
          </div>

          <button onClick={handleSave}
            style={{ padding: 12, borderRadius: 14, border: "none", background: saved ? "#16a34a" : "linear-gradient(135deg,hsl(4,65%,48%),hsl(4,60%,38%))", color: "#FFF9F0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }}>
            {saved ? <><CheckCircle size={16} />Sent!</> : <><MessageSquare size={16} />Send Reply</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Issues Panel ─────────────────────────────────────────────────────────────
function IssuesPanel() {
  const { issues, markRead, markAllRead, updateIssueStatus } = useIssues();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");

  const filtered = useMemo(() => {
    const list = filterStatus === "all" ? issues : issues.filter(i => i.status === filterStatus);
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [issues, filterStatus]);

  return (
    <div style={{ fontFamily: "Poppins,system-ui,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap" as const, gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          {(["all","open","in_progress","resolved","closed"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: filterStatus === s ? "hsl(4,60%,44%)" : "rgba(139,94,60,0.06)", color: filterStatus === s ? "#FFF9F0" : "hsl(25,38%,50%)" }}>
              {s === "all" ? "All" : ISSUE_STATUS_CFG[s].label}
              <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 11 }}>
                {s === "all" ? issues.length : issues.filter(i => i.status === s).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={markAllRead}
          style={{ padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
          Mark All Read
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "hsl(30,100%,98%)", borderRadius: 16, border: "1px solid rgba(139,94,60,0.1)" }}>
          <CheckCircle size={36} style={{ margin: "0 auto 10px", display: "block", color: "#16a34a", opacity: 0.5 }} />
          <p style={{ fontWeight: 700, fontSize: 15, color: "hsl(18,18%,20%)" }}>No issues {filterStatus !== "all" ? `with status "${filterStatus}"` : "raised"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((issue, i) => {
            const cfg = ISSUE_STATUS_CFG[issue.status];
            return (
              <motion.div key={issue.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => markRead(issue.id)}
                style={{ borderRadius: 14, overflow: "hidden", background: "hsl(30,100%,98%)", border: `1px solid ${!issue.read ? "rgba(220,38,38,0.3)" : "rgba(139,94,60,0.1)"}`, boxShadow: !issue.read ? "0 2px 10px rgba(220,38,38,0.08)" : "0 1px 4px rgba(139,94,60,0.05)" }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        {!issue.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", display: "inline-block", flexShrink: 0 }} />}
                        <p style={{ fontSize: 13, fontWeight: 700, color: "hsl(18,18%,14%)" }}>{issue.issueType}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "hsl(25,38%,45%)", marginBottom: 4 }}>{issue.description}</p>
                      <p style={{ fontSize: 11, color: "hsl(25,38%,55%)" }}>
                        {issue.customerName}{issue.customerEmail ? ` · ${issue.customerEmail}` : ""} · Order #{issue.orderNumber}
                      </p>
                      <p style={{ fontSize: 10, color: "hsl(25,38%,60%)", marginTop: 2 }}>{fmt(issue.createdAt)}</p>
                      {issue.adminReply && (
                        <div style={{ marginTop: 8, background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 8, padding: "8px 10px" }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", marginBottom: 2 }}>Your reply:</p>
                          <p style={{ fontSize: 12, color: "hsl(18,18%,25%)" }}>{issue.adminReply}</p>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                      <button onClick={(e) => { e.stopPropagation(); setReplyingId(issue.id); }}
                        style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: "hsl(4,60%,44%)", color: "#FFF9F0", display: "flex", alignItems: "center", gap: 4 }}>
                        <MessageSquare size={11} />Reply
                      </button>
                      {issue.status !== "closed" && (
                        <button onClick={(e) => { e.stopPropagation(); updateIssueStatus(issue.id, "closed"); }}
                          style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit", background: "rgba(107,114,128,0.1)", color: "#6b7280" }}>
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {replyingId && (
          <IssueReplyModal key={replyingId} issueId={replyingId} onClose={() => setReplyingId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { orders, updateOrderStatus, updateOrderDetails, seedIfEmpty } = useOrders();
  const { issues } = useIssues();

  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("kb_admin_auth") === "1");
  const [activeTab, setActiveTab] = useState<"orders" | "issues">("orders");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => { seedIfEmpty(); }, [seedIfEmpty]);

  const unreadIssues = useMemo(() => issues.filter(i => !i.read).length, [issues]);

  function logout() { sessionStorage.removeItem("kb_admin_auth"); setLoggedIn(false); }

  function handleUpdateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    updateOrderStatus(orderId, status);
    setTimeout(() => setUpdatingId(null), 400);
  }

  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    shipped:   orders.filter(o => ["shipped","out_for_delivery"].includes(o.status)).length,
    delivered: orders.filter(o => o.status === "delivered").length,
    revenue:   orders.filter(o => !["cancelled","returned"].includes(o.status)).reduce((s, o) => s + o.totalAmount, 0),
  }), [orders]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      const matchSearch = !q ||
        o.id.toLowerCase().includes(q) ||
        (o.orderNumber ?? "").toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.razorpayPaymentId || "").toLowerCase().includes(q) ||
        (o.trackingId || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, filterStatus]);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "hsl(30,60%,96%)", fontFamily: "Poppins,system-ui,sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "hsl(4,60%,12%)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,249,240,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={18} color="#FFF9F0" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#FFF9F0", lineHeight: 1 }}>Kasthuribai</p>
            <p style={{ fontSize: 11, color: "rgba(255,249,240,0.45)", marginTop: 2 }}>Admin Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
          {/* Tab switcher */}
          {(["orders","issues"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", position: "relative", background: activeTab === tab ? "rgba(255,249,240,0.15)" : "transparent", color: activeTab === tab ? "#FFF9F0" : "rgba(255,249,240,0.5)", transition: "all 0.15s" }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "issues" && unreadIssues > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#dc2626", fontSize: 9, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unreadIssues > 9 ? "9+" : unreadIssues}
                </span>
              )}
            </button>
          ))}
          <button onClick={() => setLastRefreshed(new Date())}
            style={{ padding: "7px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,249,240,0.1)", color: "#FFF9F0", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
            <RefreshCw size={13} />
          </button>
          <button onClick={logout}
            style={{ padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(220,38,38,0.15)", color: "#fca5a5", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
            <LogOut size={13} />Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <AnimatePresence mode="wait">

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Total Orders", value: stats.total,     color: "#1e40af", bg: "rgba(30,64,175,0.08)",  icon: ShoppingBag },
                  { label: "Pending",      value: stats.pending,   color: "#d97706", bg: "rgba(217,119,6,0.08)",  icon: Clock },
                  { label: "Confirmed",    value: stats.confirmed, color: "#2563eb", bg: "rgba(37,99,235,0.08)",  icon: CheckCircle2 },
                  { label: "Shipped",      value: stats.shipped,   color: "#7c3aed", bg: "rgba(124,58,237,0.08)", icon: Truck },
                  { label: "Delivered",    value: stats.delivered, color: "#16a34a", bg: "rgba(22,163,74,0.08)",  icon: Package },
                  { label: "Revenue",      value: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "hsl(4,60%,44%)", bg: "rgba(181,58,46,0.08)", icon: TrendingUp },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ borderRadius: 16, padding: "14px 16px", background: "hsl(30,100%,98%)", border: "1px solid rgba(139,94,60,0.1)", boxShadow: "0 2px 8px rgba(139,94,60,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)" }}>{s.label}</p>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <s.icon size={14} color={s.color} />
                      </div>
                    </div>
                    <p style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const, marginBottom: 18 }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "hsl(25,38%,50%)" }} />
                  <input placeholder="Search orders, customers, tracking IDs…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, borderRadius: 12, border: "1.5px solid rgba(139,94,60,0.15)", fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", background: "hsl(30,100%,98%)", color: "hsl(18,18%,14%)" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {(["all", ...ALL_STATUSES] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s as OrderStatus | "all")}
                      style={{ padding: "7px 12px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit", border: filterStatus === s ? "none" : "1px solid rgba(139,94,60,0.15)", background: filterStatus === s ? "hsl(4,60%,44%)" : "hsl(30,100%,98%)", color: filterStatus === s ? "#FFF9F0" : "hsl(25,38%,45%)" }}>
                      {s === "all" ? "All" : STATUS_CONFIG[s as OrderStatus].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order list */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", background: "hsl(30,100%,98%)", borderRadius: 20, border: "1px solid rgba(139,94,60,0.1)" }}>
                  <ShoppingBag size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.2 }} />
                  <p style={{ fontWeight: 700, fontSize: 16, color: "hsl(18,18%,20%)", marginBottom: 6 }}>
                    {orders.length === 0 ? "No orders yet" : "No orders match your filter"}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 12, color: "hsl(25,38%,50%)", marginBottom: 4 }}>
                    Showing {filtered.length} of {orders.length} orders
                  </p>
                  {filtered.map((order, i) => {
                    const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                    const StatusIcon = sc.icon;
                    const isExpanded = expandedId === order.id;

                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        style={{ borderRadius: 18, overflow: "hidden", background: "hsl(30,100%,98%)", border: `1px solid ${isExpanded ? "rgba(181,58,46,0.25)" : "rgba(139,94,60,0.1)"}`, boxShadow: isExpanded ? "0 4px 20px rgba(181,58,46,0.1)" : "0 2px 8px rgba(139,94,60,0.05)", transition: "box-shadow 0.2s,border-color 0.2s" }}>

                        {/* Row header */}
                        <div onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer", flexWrap: "wrap" as const }}>
                          <div style={{ minWidth: 130 }}>
                            <p style={{ fontSize: 13, fontWeight: 800, color: "hsl(4,60%,44%)", marginBottom: 2 }}>
                              #{(order.orderNumber ?? order.id.slice(-8)).toUpperCase()}
                            </p>
                            <p style={{ fontSize: 11, color: "hsl(25,38%,50%)" }}>
                              <Calendar size={10} style={{ display: "inline", marginRight: 3 }} />{fmt(order.createdAt)}
                            </p>
                          </div>
                          <div style={{ flex: 1, minWidth: 130 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "hsl(18,18%,14%)", marginBottom: 2 }}>{order.customerName}</p>
                            <p style={{ fontSize: 11, color: "hsl(25,38%,50%)" }}>
                              {order.customerPhone}{order.customerEmail ? ` · ${order.customerEmail}` : ""}
                            </p>
                          </div>
                          <div style={{ minWidth: 90 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(18,18%,20%)", marginBottom: 2 }}>
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                            <p style={{ fontSize: 11, color: "hsl(25,38%,50%)", whiteSpace: "nowrap" as const }}>
                              {order.items.map(it => it.name.split(" ")[0]).slice(0, 2).join(", ")}{order.items.length > 2 ? "…" : ""}
                            </p>
                          </div>
                          <p style={{ fontSize: 16, fontWeight: 800, color: "hsl(4,60%,44%)", minWidth: 80, textAlign: "right" as const }}>
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: sc.bg }}>
                            <StatusIcon size={12} color={sc.color} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{sc.label}</span>
                          </div>
                          <ChevronDown size={15} color="hsl(25,38%,55%)" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                        </div>

                        {/* Expanded detail */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div key="detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                              <div style={{ borderTop: "1px solid rgba(139,94,60,0.1)", padding: "16px 18px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>

                                {/* Customer info */}
                                <div>
                                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 10 }}>Customer</p>
                                  {[
                                    { icon: User,       text: order.customerName },
                                    { icon: Phone,      text: order.customerPhone },
                                    ...(order.customerEmail ? [{ icon: Mail, text: order.customerEmail }] : []),
                                    { icon: MapPin,     text: order.shippingAddress },
                                    ...(order.razorpayPaymentId ? [{ icon: CreditCard, text: order.razorpayPaymentId, mono: true }] : []),
                                    ...(order.trackingId ? [{ icon: Package, text: `${order.courier ?? ""} · ${order.trackingId}` }] : []),
                                  ].map((row, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: 7, marginBottom: 7, alignItems: "flex-start" }}>
                                      <row.icon size={12} color="hsl(25,38%,55%)" style={{ flexShrink: 0, marginTop: 2 }} />
                                      <p style={{ fontSize: 12, color: "hsl(18,18%,20%)", fontFamily: (row as any).mono ? "monospace" : "inherit", wordBreak: "break-all" as const }}>{row.text}</p>
                                    </div>
                                  ))}
                                  {order.notes && (
                                    <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.15)" }}>
                                      <p style={{ fontSize: 11, color: "#d97706" }}><MessageSquare size={10} style={{ display: "inline", marginRight: 4 }} />{order.notes}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Order items */}
                                <div>
                                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 10 }}>Order Items</p>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                                      <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(18,18%,14%)" }}>{item.name}</p>
                                        <p style={{ fontSize: 11, color: "hsl(25,38%,55%)" }}>
                                          {item.category} · Qty {item.quantity}
                                          {(item as any).size ? ` · ${(item as any).size}` : ""}
                                          {(item as any).color ? ` · ${(item as any).color}` : ""}
                                        </p>
                                      </div>
                                      <p style={{ fontSize: 12, fontWeight: 700, color: "hsl(4,60%,44%)", whiteSpace: "nowrap" as const }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                    </div>
                                  ))}
                                  <div style={{ borderTop: "1px solid rgba(139,94,60,0.12)", paddingTop: 7, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: "hsl(4,60%,44%)" }}>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>

                                {/* Update status */}
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "hsl(25,38%,50%)" }}>Update Status</p>
                                    <button onClick={() => setEditingId(order.id)}
                                      style={{ padding: "5px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: "rgba(37,99,235,0.1)", color: "#2563eb", display: "flex", alignItems: "center", gap: 4 }}>
                                      <Edit3 size={11} />Edit Details
                                    </button>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                    {ALL_STATUSES.map(s => {
                                      const cfg = STATUS_CONFIG[s];
                                      const Icon2 = cfg.icon;
                                      const isCurrent = order.status === s;
                                      return (
                                        <button key={s} disabled={isCurrent || updatingId === order.id} onClick={() => handleUpdateStatus(order.id, s)}
                                          style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10, border: "none", cursor: isCurrent ? "default" : "pointer", background: isCurrent ? cfg.bg : "rgba(139,94,60,0.04)", fontFamily: "inherit", transition: "background 0.15s", opacity: updatingId === order.id && !isCurrent ? 0.5 : 1 }}>
                                          <Icon2 size={12} color={isCurrent ? cfg.color : "hsl(25,38%,55%)"} />
                                          <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? cfg.color : "hsl(25,38%,45%)" }}>{cfg.label}</span>
                                          {isCurrent && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: cfg.color }}>● CURRENT</span>}
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
            </motion.div>
          )}

          {/* ── ISSUES TAB ── */}
          {activeTab === "issues" && (
            <motion.div key="issues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Bell size={20} color="hsl(4,60%,44%)" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "hsl(18,18%,14%)" }}>Customer Issues</h2>
                {unreadIssues > 0 && (
                  <span style={{ padding: "2px 10px", borderRadius: 999, background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                    {unreadIssues} new
                  </span>
                )}
              </div>
              <IssuesPanel />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingId && <EditDetailsModal key={editingId} orderId={editingId} onClose={() => setEditingId(null)} />}
      </AnimatePresence>
    </div>
  );
}
