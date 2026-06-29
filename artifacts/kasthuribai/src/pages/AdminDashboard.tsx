import { useState, useMemo } from "react";
import { useOrders, OrderStatus } from "@/store/use-orders";
import { formatPrice } from "@/lib/utils";
import {
  LayoutDashboard, Package, Users, Truck, TrendingUp, Search,
  ChevronDown, ChevronRight, CheckCircle2, Clock, AlertCircle,
  XCircle, RefreshCcw, ArrowLeft, Eye, Filter, Download,
} from "lucide-react";
import { Link } from "wouter";

// ── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  pending:          { label: "Pending",          color: "text-amber-700",   bg: "bg-amber-100",   icon: Clock         },
  confirmed:        { label: "Confirmed",        color: "text-blue-700",    bg: "bg-blue-100",    icon: CheckCircle2  },
  processing:       { label: "Processing",       color: "text-indigo-700",  bg: "bg-indigo-100",  icon: RefreshCcw    },
  shipped:          { label: "Shipped",          color: "text-violet-700",  bg: "bg-violet-100",  icon: Truck         },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-700",  bg: "bg-orange-100",  icon: Truck         },
  delivered:        { label: "Delivered",        color: "text-green-700",   bg: "bg-green-100",   icon: CheckCircle2  },
  cancelled:        { label: "Cancelled",        color: "text-red-700",     bg: "bg-red-100",     icon: XCircle       },
};

const STATUS_FLOW: OrderStatus[] = ["pending","confirmed","processing","shipped","out_for_delivery","delivered"];

type Tab = "overview" | "orders" | "customers" | "shipping";

// ── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof TrendingUp; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── Order detail panel ────────────────────────────────────────────────────

function OrderDetail({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <p className="font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <XCircle className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status stepper */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s) => (
                <button key={s}
                  onClick={() => updateOrderStatus(order.id, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${order.status === s ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary"}`}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
              <button onClick={() => updateOrderStatus(order.id, "cancelled")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${order.status === "cancelled" ? "bg-red-500 text-white border-red-500" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-500"}`}>
                Cancel
              </button>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Customer Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><p className="text-[10px] text-gray-400">Name</p><p className="text-sm font-semibold text-gray-800">{order.customerName}</p></div>
              <div><p className="text-[10px] text-gray-400">Email</p><p className="text-sm font-semibold text-gray-800 break-all">{order.customerEmail}</p></div>
              <div><p className="text-[10px] text-gray-400">Phone</p><p className="text-sm font-semibold text-gray-800">{order.customerPhone}</p></div>
              <div><p className="text-[10px] text-gray-400">Current Status</p><StatusBadge status={order.status} /></div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Shipping Address
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-primary/10 to-gold/10 rounded-2xl p-4 flex items-center justify-between">
            <p className="font-bold text-gray-700">Total Amount</p>
            <p className="text-2xl font-bold text-primary font-display">{formatPrice(order.totalAmount)}</p>
          </div>

          {/* Tracking steps */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tracking Timeline</p>
            <div className="space-y-2">
              {order.trackingSteps.filter(s => s.completed).map((step) => (
                <div key={step.status} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                    {step.timestamp && <p className="text-[10px] text-gray-400">{formatDate(step.timestamp)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useOrders();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ── Stats ──
  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0);
    const pending = orders.filter(o => ["pending","confirmed","processing"].includes(o.status)).length;
    const shipped = orders.filter(o => ["shipped","out_for_delivery"].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === "delivered").length;
    const customers = new Set(orders.map(o => o.customerEmail)).size;
    return { total, revenue, pending, shipped, delivered, customers };
  }, [orders]);

  // ── Unique customers ──
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; orders: number; total: number; lastOrder: string }>();
    orders.forEach((o) => {
      if (map.has(o.customerEmail)) {
        const c = map.get(o.customerEmail)!;
        c.orders++;
        c.total += o.totalAmount;
        if (o.createdAt > c.lastOrder) c.lastOrder = o.createdAt;
      } else {
        map.set(o.customerEmail, { name: o.customerName, email: o.customerEmail, phone: o.customerPhone, orders: 1, total: o.totalAmount, lastOrder: o.createdAt });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  // ── Filtered orders ──
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.customerPhone.includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview",   label: "Overview",   icon: LayoutDashboard },
    { id: "orders",     label: "Orders",     icon: Package          },
    { id: "customers",  label: "Customers",  icon: Users            },
    { id: "shipping",   label: "Shipping",   icon: Truck            },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <span className="text-gray-200">|</span>
            <div>
              <span className="font-display font-bold text-gray-900 text-lg">Admin Dashboard</span>
              <span className="ml-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Kasthuribai</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto pb-0" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === "orders" && orders.length > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{orders.length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">Good day! 👋</h1>
              <p className="text-gray-500 text-sm mt-0.5">Here's what's happening at Kasthuribai Ready Mades.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Package} label="Total Orders" value={String(stats.total)} sub="All time" color="bg-primary" />
              <StatCard icon={TrendingUp} label="Total Revenue" value={stats.revenue > 0 ? formatPrice(stats.revenue) : "₹0"} sub="Paid orders" color="bg-emerald-500" />
              <StatCard icon={Users} label="Customers" value={String(stats.customers)} sub="Unique buyers" color="bg-violet-500" />
              <StatCard icon={Clock} label="Pending" value={String(stats.pending)} sub="Need attention" color="bg-amber-500" />
            </div>

            {/* Quick status breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-gray-800 mb-4">Order Status Breakdown</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => {
                  const count = orders.filter(o => o.status === s).length;
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s} onClick={() => { setTab("orders"); setStatusFilter(s); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${cfg.bg} hover:scale-105 transition-transform cursor-pointer`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                      <span className="text-xl font-bold text-gray-900">{count}</span>
                      <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent orders */}
            {orders.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="font-bold text-gray-800">Recent Orders</p>
                  <button onClick={() => setTab("orders")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{order.customerName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{order.customerName}</p>
                        <p className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <button onClick={() => setSelectedOrderId(order.id)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary/10 transition-colors flex-shrink-0">
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orders.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1">Orders placed by customers will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone or order ID…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                  className="pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                  <option value="all">All Statuses</option>
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No orders found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-gray-800 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-[10px] text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <p className="font-semibold text-gray-800">{order.customerName}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[160px]">{order.customerEmail}</p>
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setSelectedOrderId(order.id)}
                                className="px-2.5 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab === "customers" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="font-bold text-gray-800">All Customers ({customers.length})</p>
              </div>
              {customers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No customers yet</p>
                  <p className="text-gray-400 text-sm mt-1">Customer details will appear here once orders are placed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Last Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map((c) => (
                        <tr key={c.email} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary">{c.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{c.name}</p>
                                <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{c.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <p className="text-sm text-gray-700">{c.phone}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{c.orders}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-gray-900">{formatPrice(c.total)}</p>
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            <p className="text-xs text-gray-500">{formatDate(c.lastOrder)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SHIPPING ── */}
        {tab === "shipping" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              <StatCard icon={Package}    label="To Ship"       value={String(orders.filter(o => o.status === "processing").length)}        sub="Ready to ship"      color="bg-indigo-500" />
              <StatCard icon={Truck}      label="In Transit"    value={String(orders.filter(o => ["shipped","out_for_delivery"].includes(o.status)).length)} sub="On the way" color="bg-orange-500" />
              <StatCard icon={CheckCircle2} label="Delivered"  value={String(orders.filter(o => o.status === "delivered").length)}           sub="Completed"          color="bg-green-500" />
            </div>

            {["processing", "shipped", "out_for_delivery"].map((filterStatus) => {
              const filtered = orders.filter(o => o.status === filterStatus);
              if (filtered.length === 0) return null;
              const cfg = STATUS_CONFIG[filterStatus as OrderStatus];
              const Icon = cfg.icon;
              return (
                <div key={filterStatus} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`flex items-center gap-2 px-5 py-4 border-b border-gray-100 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <p className={`font-bold text-sm ${cfg.color}`}>{cfg.label} ({filtered.length})</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {filtered.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{order.customerName}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{order.shippingAddress}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                          <div className="flex gap-1 mt-1.5 justify-end">
                            {filterStatus !== "out_for_delivery" && (
                              <button onClick={() => updateOrderStatus(order.id, filterStatus === "processing" ? "shipped" : "out_for_delivery")}
                                className="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary/90 transition-colors">
                                {filterStatus === "processing" ? "Mark Shipped" : "Out for Delivery"}
                              </button>
                            )}
                            {filterStatus === "out_for_delivery" && (
                              <button onClick={() => updateOrderStatus(order.id, "delivered")}
                                className="px-2.5 py-1 bg-green-500 text-white rounded-lg text-[10px] font-bold hover:bg-green-600 transition-colors">
                                Mark Delivered
                              </button>
                            )}
                            <button onClick={() => setSelectedOrderId(order.id)}
                              className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {orders.filter(o => ["processing","shipped","out_for_delivery"].includes(o.status)).length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No active shipments</p>
                <p className="text-gray-400 text-sm mt-1">Confirmed orders will appear here for shipping management.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Order detail modal */}
      {selectedOrderId && (
        <OrderDetail orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  );
}
