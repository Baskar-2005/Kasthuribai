import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useOrders, Order, OrderStatus } from "@/store/use-orders";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone,
  User, Search, RefreshCw, ChevronRight, RotateCcw, Sparkles,
  ArrowLeft, Star, Mail, BadgeCheck, Shield, Zap,
} from "lucide-react";

/* ─── Status config ─────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: any; progress: number }> = {
  pending:          { label: "Order Placed",      color: "#b45309", bg: "#fffbeb", border: "#fde68a", icon: Clock,         progress: 10 },
  confirmed:        { label: "Confirmed",          color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", icon: BadgeCheck,    progress: 30 },
  packed:           { label: "Packed",             color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: Package,       progress: 50 },
  shipped:          { label: "Shipped",            color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd", icon: Truck,         progress: 68 },
  out_for_delivery: { label: "Out for Delivery",   color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", icon: Zap,           progress: 85 },
  delivered:        { label: "Delivered ✓",        color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle,   progress: 100 },
  cancelled:        { label: "Cancelled",          color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", icon: XCircle,       progress: 100 },
  returned:         { label: "Returned",           color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8", icon: RotateCcw,     progress: 100 },
  refunded:         { label: "Refunded",           color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4", icon: CheckCircle,   progress: 100 },
};

const TIMELINE_STEPS: Array<{ status: OrderStatus; label: string; icon: any }> = [
  { status: "pending",          label: "Order Placed",       icon: Clock },
  { status: "confirmed",        label: "Confirmed",          icon: BadgeCheck },
  { status: "packed",           label: "Packed",             icon: Package },
  { status: "shipped",          label: "Shipped",            icon: Truck },
  { status: "out_for_delivery", label: "Out for Delivery",   icon: Zap },
  { status: "delivered",        label: "Delivered",          icon: CheckCircle },
];

/* ─── Helpers ───────────────────────────────────────────────────────── */
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const fmtShort = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ─── Sub-components ────────────────────────────────────────────────── */

function HeroSection({ query, setQuery, onSearch, onReset, searched }: {
  query: string; setQuery: (v: string) => void;
  onSearch: () => void; onReset: () => void; searched: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const quickTry = (val: string) => { setQuery(val); setTimeout(() => inputRef.current?.focus(), 0); };

  return (
    <div className="relative overflow-hidden">
      {/* ── Warm radial gradient background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #fef3c7 0%, #fffbeb 40%, #fff9f0 70%, #ffffff 100%)",
        }}
      />
      {/* Decorative golden arcs */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" aria-hidden>
        <ellipse cx="10%" cy="30%" rx="160" ry="100" fill="none" stroke="#e5c76b" strokeWidth="1" />
        <ellipse cx="90%" cy="60%" rx="120" ry="80" fill="none" stroke="#e9b44c" strokeWidth="0.8" />
        <circle cx="80%" cy="20%" r="60" fill="none" stroke="#e5c76b" strokeWidth="0.6" />
        <circle cx="15%" cy="80%" r="40" fill="none" stroke="#f6e7b2" strokeWidth="1" />
      </svg>
      {/* Shimmer dots */}
      {[
        { x: "8%",  y: "18%", s: 6  },
        { x: "92%", y: "14%", s: 4  },
        { x: "85%", y: "75%", s: 7  },
        { x: "5%",  y: "70%", s: 5  },
        { x: "50%", y: "8%",  s: 3  },
        { x: "70%", y: "55%", s: 5  },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: dot.x, top: dot.y, width: dot.s, height: dot.s, background: "#e5c76b" }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.8 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <div className="relative max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Real-time Order Tracking
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900 leading-tight mb-4"
          style={{ fontFamily: "var(--app-font-display, 'Playfair Display', serif)" }}
        >
          Track Your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Order
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-amber-700/80 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          Enter your Order ID or registered phone number to get live updates — no login needed.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-xl mx-auto"
        >
          <div
            className="relative rounded-2xl transition-all duration-300"
            style={{
              boxShadow: focused
                ? "0 0 0 4px rgba(217,119,6,0.15), 0 8px 32px rgba(180,83,9,0.15)"
                : "0 4px 24px rgba(180,83,9,0.1)",
            }}
          >
            <div className="flex items-center bg-white rounded-2xl border-2 transition-colors duration-300"
              style={{ borderColor: focused ? "#d97706" : "#fde68a" }}>
              <Search className="ml-4 h-5 w-5 text-amber-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Order ID (KB25001) or phone number…"
                className="flex-1 px-3 py-4 text-sm sm:text-base bg-transparent outline-none text-amber-900 placeholder:text-amber-300 font-medium"
              />
              {query && (
                <button onClick={onReset} className="mr-2 p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onSearch}
                disabled={!query.trim()}
                className="m-1.5 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #d97706, #b45309)",
                  boxShadow: query.trim() ? "0 4px 12px rgba(180,83,9,0.3)" : "none",
                }}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Track</span>
              </button>
            </div>
          </div>

          {/* Quick try */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-amber-500">Quick try →</span>
            {["KB25001", "KB25002", "KB25003", "9876543210"].map((v) => (
              <button
                key={v}
                onClick={() => quickTry(v)}
                className="text-xs font-mono px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-colors"
              >
                {v}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-10 flex-wrap"
        >
          {[
            { icon: Shield, text: "No login required" },
            { icon: Zap, text: "Live status" },
            { icon: Star, text: "Trusted by 1K+ customers" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-amber-600">
              <Icon className="h-3.5 w-3.5 text-amber-500" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Animated progress timeline ── */
function Timeline({ order }: { order: Order }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isCancelled = ["cancelled", "returned", "refunded"].includes(order.status);
  const currentIdx = TIMELINE_STEPS.findIndex((s) => s.status === order.status);

  if (isCancelled) return null;

  return (
    <div ref={ref} className="relative py-2">
      {/* Connecting line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-amber-100 rounded-full" />
      {/* Progress fill */}
      <motion.div
        className="absolute left-5 top-5 w-0.5 rounded-full origin-top"
        style={{ background: "linear-gradient(to bottom, #d97706, #92400e)" }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: currentIdx < 0 ? 0 : (currentIdx / (TIMELINE_STEPS.length - 1)) } : { scaleY: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      <div className="space-y-0">
        {TIMELINE_STEPS.map((step, i) => {
          const stepDone = i <= currentIdx;
          const stepCurrent = i === currentIdx;
          const StepIcon = step.icon;
          const trackStep = order.trackingSteps.find((s) => s.status === step.status);

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="relative flex items-start gap-4 pb-6 last:pb-0 pl-2"
            >
              {/* Icon circle */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    stepDone
                      ? "border-amber-500 bg-amber-500 shadow-md"
                      : "border-amber-200 bg-white"
                  }`}
                  animate={stepCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <StepIcon className={`h-3.5 w-3.5 ${stepDone ? "text-white" : "text-amber-300"}`} />
                </motion.div>
                {stepCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-amber-400"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Text */}
              <div className={`flex-1 pt-0.5 ${!stepDone ? "opacity-40" : ""}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`font-semibold text-sm ${stepCurrent ? "text-amber-700" : stepDone ? "text-amber-900" : "text-gray-400"}`}>
                    {step.label}
                    {stepCurrent && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                        Current
                      </span>
                    )}
                  </span>
                  {trackStep?.timestamp && stepDone && (
                    <span className="text-[11px] text-amber-500">{fmt(trackStep.timestamp)}</span>
                  )}
                </div>
                {trackStep?.description && stepDone && (
                  <p className="text-xs text-amber-600/70 mt-0.5">{trackStep.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Stat chip ── */
function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 border ${accent ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
      <p className="text-[11px] text-amber-500 font-medium mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${accent ? "text-amber-800" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}

/* ── Full order detail ── */
function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;
  const isCancelled = ["cancelled", "returned", "refunded"].includes(order.status);

  return (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 font-medium mb-6 group"
      >
        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
        Back to results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Status hero card */}
          <div
            className="rounded-2xl border p-6 relative overflow-hidden"
            style={{ background: cfg.bg, borderColor: cfg.border }}
          >
            {/* Large faded icon in bg */}
            <StatusIcon className="absolute right-4 top-4 opacity-[0.07] w-24 h-24" style={{ color: cfg.color }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full border"
                  style={{ color: cfg.color, background: `${cfg.bg}`, borderColor: cfg.border }}
                >
                  <StatusIcon className="h-4 w-4" />
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-400">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-bold text-amber-900 mb-1" style={{ fontFamily: "var(--app-font-display, serif)" }}>
                {isCancelled
                  ? order.status === "cancelled" ? "Order Cancelled" : order.status === "returned" ? "Return Processed" : "Refund Processed"
                  : order.estimatedDelivery
                  ? `Est. delivery: ${fmtShort(order.estimatedDelivery)}`
                  : "In Progress"}
              </h2>
              {order.currentLocation && !isCancelled && (
                <p className="text-sm text-amber-700 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {order.currentLocation}
                  {order.currentHub && <span className="text-amber-500"> · {order.currentHub}</span>}
                </p>
              )}
            </div>

            {/* Progress bar */}
            {!isCancelled && (
              <div className="mt-5 h-2 bg-white/60 rounded-full overflow-hidden border border-amber-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f59e0b, #d97706, #b45309)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cfg.progress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            )}
          </div>

          {/* Timeline (if not cancelled) */}
          {!isCancelled && (
            <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-amber-900 mb-5 text-sm uppercase tracking-wider">Order Journey</h3>
              <Timeline order={order} />
            </div>
          )}

          {/* Cancelled / returned info */}
          {isCancelled && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div>
                  <h3 className="font-bold text-red-800">
                    {order.status === "cancelled" ? "Order was cancelled" : order.status === "returned" ? "Return initiated" : "Refund processed"}
                  </h3>
                  {order.refundAmount && (
                    <p className="text-sm text-red-600 mt-0.5">
                      Refund of {money(order.refundAmount)} via {order.refundMethod}
                      {order.refundStatus && ` — ${order.refundStatus}`}
                    </p>
                  )}
                </div>
              </div>
              {order.trackingSteps.filter((s) => s.completed).slice(-1).map((s) => (
                <p key={s.status} className="text-xs text-red-500 mt-2">{fmt(s.timestamp)} · {s.description}</p>
              ))}
            </div>
          )}

          {/* Items */}
          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-amber-900 mb-4 text-sm uppercase tracking-wider">Items in this Order</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-amber-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-amber-900 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-amber-500 mt-0.5">
                      Qty {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}
                    </p>
                    <p className="text-sm font-bold text-amber-800 mt-1">{money(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Order summary */}
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-amber-900 mb-4 text-sm uppercase tracking-wider">Order Summary</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Stat label="Order ID" value={`#${order.orderNumber || order.id.slice(-8).toUpperCase()}`} accent />
              <Stat label="Placed On" value={new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })} />
              <Stat label="Payment" value={order.paymentMethod} />
              <Stat label="Items" value={String(order.items.reduce((a, b) => a + b.quantity, 0))} />
            </div>
            <div className="border-t border-amber-100 pt-3 space-y-1.5 text-sm">
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>−{money(order.discount)}</span>
                </div>
              )}
              {order.shippingCharge > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span><span>{money(order.shippingCharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-amber-900 text-base pt-1 border-t border-amber-100">
                <span>Total</span><span>{money(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          {(order.courier || order.trackingId) && (
            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-500" /> Shipment
              </h3>
              <div className="space-y-2 text-sm">
                {order.courier && <div className="flex justify-between"><span className="text-amber-500">Courier</span><span className="font-medium text-amber-900">{order.courier}</span></div>}
                {order.trackingId && (
                  <div className="flex justify-between items-center">
                    <span className="text-amber-500">Tracking</span>
                    <span className="font-mono text-xs bg-amber-50 border border-amber-200 px-2 py-1 rounded text-amber-800">{order.trackingId}</span>
                  </div>
                )}
                {order.deliveryAgent && <div className="flex justify-between"><span className="text-amber-500">Agent</span><span className="font-medium text-amber-900">{order.deliveryAgent}</span></div>}
                {order.deliveryAgentPhone && <div className="flex justify-between"><span className="text-amber-500">Contact</span><span className="text-amber-900">{order.deliveryAgentPhone}</span></div>}
              </div>
            </div>
          )}

          {/* Delivery address */}
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wider">Delivery To</h3>
            <div className="space-y-2.5 text-sm">
              {[
                { Icon: User,   val: order.customerName,  bold: true },
                { Icon: Phone,  val: order.customerPhone, bold: false },
                { Icon: Mail,   val: order.customerEmail || "—", bold: false },
                { Icon: MapPin, val: order.shippingAddress, bold: false },
              ].map(({ Icon, val, bold }) => (
                <div key={val} className="flex items-start gap-2.5">
                  <Icon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className={`${bold ? "font-semibold text-amber-900" : "text-amber-700"} leading-snug`}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/919876543210?text=Hi%2C+I+need+help+with+order+%23${order.orderNumber || order.id}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
          >
            <Phone className="h-4 w-4" />
            WhatsApp Support
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Result card in list ── */
function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(180,83,9,0.12)" }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left border border-amber-100 bg-white rounded-2xl p-5 transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-bold text-amber-900 text-sm">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
              style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
            >
              <StatusIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-amber-700 font-medium">
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · {money(order.totalAmount)}
          </p>
          {order.estimatedDelivery && !["cancelled","returned","refunded"].includes(order.status) && (
            <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" />
              {["delivered"].includes(order.status) ? "Delivered" : `Expected ${fmtShort(order.estimatedDelivery)}`}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Placed {fmt(order.createdAt)}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
          <ChevronRight className="h-4 w-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
        </div>
      </div>
      {/* Mini progress strip */}
      {!["cancelled","returned","refunded"].includes(order.status) && (
        <div className="mt-3 h-1 bg-amber-50 rounded-full overflow-hidden border border-amber-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${cfg.progress}%`,
              background: "linear-gradient(90deg, #f59e0b, #b45309)",
            }}
          />
        </div>
      )}
    </motion.button>
  );
}

/* ── Empty / not-found state ── */
function NotFound({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 max-w-sm mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto mb-5">
        <Package className="h-10 w-10 text-amber-300" />
      </div>
      <h3 className="text-xl font-bold text-amber-900 mb-2">No orders found</h3>
      <p className="text-amber-600 text-sm mb-6 leading-relaxed">
        We couldn't find any orders matching <strong className="text-amber-800">"{query}"</strong>.{" "}
        Double-check your Order ID (e.g. KB25001) or the phone number you used.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border-2 border-amber-200 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/my-orders"
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
          style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
        >
          My Orders
        </a>
      </div>
    </motion.div>
  );
}

/* ── Hint cards shown before search ── */
function HintCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {[
        {
          icon: Package, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200",
          title: "Order ID", desc: "Find it in your confirmation SMS or email. Format: KB25001 or ORD-2025-001",
        },
        {
          icon: Phone, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
          title: "Phone Number", desc: "Use the mobile number you registered when placing the order",
        },
        {
          icon: Truck, color: "text-green-600", bg: "bg-green-50", border: "border-green-200",
          title: "Live Updates", desc: "Real-time status from order placed to delivered at your doorstep",
        },
      ].map(({ icon: Icon, color, bg, border, title, desc }) => (
        <motion.div
          key={title}
          whileHover={{ y: -3 }}
          className={`p-5 rounded-2xl border ${bg} ${border} cursor-default`}
        >
          <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-3`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export default function TrackOrder() {
  const { orders, seedIfEmpty } = useOrders();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => { seedIfEmpty(); }, [seedIfEmpty]);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const matches = orders.filter((o) => {
      const idMatch =
        o.id.toLowerCase().includes(q) ||
        (o.orderNumber ?? "").toLowerCase().includes(q);
      const phoneMatch = o.customerPhone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
      return idMatch || phoneMatch;
    });
    setResults(matches);
    setSearched(true);
    setSelected(null);
  };

  const handleReset = () => {
    setQuery(""); setSearched(false); setResults([]); setSelected(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <HeroSection
        query={query} setQuery={setQuery}
        onSearch={handleSearch} onReset={handleReset}
        searched={searched}
      />

      {/* Divider wave */}
      <div className="w-full overflow-hidden -mt-px leading-none">
        <svg viewBox="0 0 1440 48" className="w-full" preserveAspectRatio="none" style={{ height: 48 }}>
          <path d="M0,48 C360,0 1080,48 1440,0 L1440,48 Z" fill="#ffffff" />
          <path d="M0,48 C360,0 1080,48 1440,0 L1440,48 Z" fill="none" stroke="#fde68a" strokeWidth="1" />
        </svg>
      </div>

      {/* Results area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-16 -mt-2">
        <AnimatePresence mode="wait">
          {selected ? (
            <OrderDetail key="detail" order={selected} onBack={() => setSelected(null)} />
          ) : searched ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {results.length === 0 ? (
                <NotFound query={query} onReset={handleReset} />
              ) : results.length === 1 ? (
                <OrderDetail order={results[0]} onBack={handleReset} />
              ) : (
                <>
                  <p className="text-sm text-amber-600 font-medium mb-4">
                    Found <strong>{results.length} orders</strong> — select one to see details
                  </p>
                  <div className="space-y-3">
                    {results.map((o) => (
                      <OrderCard key={o.id} order={o} onClick={() => setSelected(o)} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <HintCards key="hints" />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
