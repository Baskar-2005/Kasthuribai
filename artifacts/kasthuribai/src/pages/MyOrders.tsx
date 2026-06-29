import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Search, ArrowLeft, Download, RotateCcw, AlertCircle, ShoppingBag,
  MapPin, Phone, RefreshCcw, Star, FileText, Filter, SortAsc,
  MessageSquare, ArrowRight, Banknote, Calendar,
} from "lucide-react";
import { Link } from "wouter";
import { MOCK_ORDERS, MockOrder, ExtendedOrderStatus } from "@/components/my-orders/mock-orders";
import { Navbar } from "@/components/sections/Navbar";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ExtendedOrderStatus, {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  dot: string;
}> = {
  pending:          { label: "Pending",          color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200",   icon: Clock,        dot: "bg-yellow-400" },
  confirmed:        { label: "Confirmed",         color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",     icon: CheckCircle,  dot: "bg-blue-400" },
  processing:       { label: "Processing",        color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Package,      dot: "bg-purple-400" },
  shipped:          { label: "Shipped",           color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Truck,        dot: "bg-indigo-400" },
  out_for_delivery: { label: "Out for Delivery",  color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: Truck,        dot: "bg-orange-400" },
  delivered:        { label: "Delivered",         color: "text-green-700",  bg: "bg-green-50 border-green-200",   icon: CheckCircle,  dot: "bg-green-500" },
  cancelled:        { label: "Cancelled",         color: "text-red-700",    bg: "bg-red-50 border-red-200",       icon: XCircle,      dot: "bg-red-400" },
  returned:         { label: "Returned",          color: "text-rose-700",   bg: "bg-rose-50 border-rose-200",     icon: RotateCcw,    dot: "bg-rose-400" },
  refunded:         { label: "Refunded",          color: "text-teal-700",   bg: "bg-teal-50 border-teal-200",     icon: Banknote,     dot: "bg-teal-400" },
};

const TABS: { key: ExtendedOrderStatus | "all"; label: string }[] = [
  { key: "all",              label: "All" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "shipped",          label: "Shipped" },
  { key: "processing",       label: "Processing" },
  { key: "delivered",        label: "Delivered" },
  { key: "cancelled",        label: "Cancelled" },
  { key: "returned",         label: "Returned" },
];

const TIMELINE_KEYS: ExtendedOrderStatus[] = [
  "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered",
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-gray-900">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <XCircle className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, delay }: {
  label: string; value: number | string; icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-gray-900 leading-none">{value}</div>
        <div className="text-xs text-gray-500 font-body mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function OrderTimeline({ order }: { order: MockOrder }) {
  const steps = order.timeline.filter(s => TIMELINE_KEYS.includes(s.key));

  return (
    <div className="relative ml-2">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.key} className="flex items-start gap-3 relative">
            {/* Line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 w-0.5 h-8 bg-gray-100" />
            )}
            {/* Dot */}
            <motion.div
              className={`relative z-10 flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step.completed
                  ? "bg-primary border-primary shadow-md shadow-primary/20"
                  : "bg-white border-gray-200"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
            >
              {step.completed ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              )}
              {step.active && step.completed && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>

            {/* Content */}
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <p className={`text-sm font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-400">{step.description}</p>
              {step.timestamp && (
                <p className="text-[10px] text-primary mt-0.5 font-medium">{formatDateTime(step.timestamp)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Issue Modal ──────────────────────────────────────────────────────────────
function IssueModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: MockOrder }) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const issues = ["Wrong Product", "Damaged Item", "Late Delivery", "Payment Issue", "Missing Product", "Other"];

  return (
    <Modal open={open} onClose={onClose} title="Raise an Issue">
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Issue Raised!</h4>
          <p className="text-sm text-gray-500">Our team will contact you within 24 hours.</p>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold">Done</button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">What's the issue?</label>
            <div className="grid grid-cols-2 gap-2">
              {issues.map(i => (
                <button
                  key={i}
                  onClick={() => setIssueType(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    issueType === i ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/40"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Describe the issue..."
            />
          </div>
          <button
            onClick={() => issueType && setSubmitted(true)}
            className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all ${issueType ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Submit Issue
          </button>
        </div>
      )}
    </Modal>
  );
}

// ─── Return Modal ─────────────────────────────────────────────────────────────
function ReturnModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: MockOrder }) {
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const reasons = ["Wrong Size", "Wrong Product", "Damaged", "Not as Described", "Changed Mind"];

  return (
    <Modal open={open} onClose={onClose} title="Request Return">
      {step === "form" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Order #{order.orderNumber} · {formatCurrency(order.totalAmount)}</p>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Reason for return</label>
            <div className="space-y-2">
              {reasons.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all text-left ${reason === r ? "bg-primary/5 border-primary text-primary" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${reason === r ? "border-primary" : "border-gray-300"}`}>
                    {reason === r && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => reason && setStep("confirm")}
            className={`w-full py-2.5 rounded-full font-semibold text-sm ${reason ? "bg-primary text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Continue
          </button>
        </div>
      )}
      {step === "confirm" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-sm font-semibold text-amber-800">Confirm Return Request</p>
            <p className="text-xs text-amber-700 mt-1">Reason: {reason}</p>
            <p className="text-xs text-amber-700">Refund: {formatCurrency(order.totalAmount)} to original payment method</p>
          </div>
          <p className="text-xs text-gray-500">A pickup will be scheduled within 2 business days. Please keep the item in its original packaging.</p>
          <div className="flex gap-2">
            <button onClick={() => setStep("form")} className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600">Back</button>
            <button onClick={() => setStep("done")} className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-semibold">Confirm Return</button>
          </div>
        </div>
      )}
      {step === "done" && (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Return Requested!</h4>
          <p className="text-sm text-gray-500">Pickup will be scheduled within 2 business days.</p>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold">Done</button>
        </div>
      )}
    </Modal>
  );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────
function InvoiceModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: MockOrder }) {
  const tax = Math.round(order.totalAmount * 0.05);
  return (
    <Modal open={open} onClose={onClose} title="Invoice">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-primary text-lg">KASTHURIBAI</p>
            <p className="text-xs text-gray-500">NMP Group · Chidambaram, TN</p>
            {order.gstNumber && <p className="text-xs text-gray-500">GSTIN: {order.gstNumber}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900">#{order.orderNumber}</p>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Items */}
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-800 text-xs">{item.name}</p>
                <p className="text-gray-400 text-[10px]">Qty: {item.quantity} · {item.size} · {item.color}</p>
              </div>
              <p className="font-semibold text-gray-900 text-xs">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Totals */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Subtotal</span><span>{formatCurrency(order.totalAmount + order.discount)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 text-xs">
              <span>Discount</span><span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500 text-xs">
            <span>GST (5%)</span><span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Shipping</span><span>{order.shippingCharge === 0 ? "FREE" : formatCurrency(order.shippingCharge)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-1.5">
            <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </Modal>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, index }: { order: MockOrder; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;

  const canReturn = order.status === "delivered";
  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.35 }}
      >
        {/* Status bar */}
        <div className={`h-1 w-full`} style={{ background: "linear-gradient(90deg, var(--color-primary), #c9a84c)" }} />

        <div className="p-4 sm:p-5">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order</span>
                <span className="text-sm font-bold text-gray-900">#{order.orderNumber}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <Icon className="w-3 h-3" />
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Items preview */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 max-w-[120px] line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-gray-400">Qty {item.quantity} · {item.size}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Hide Details" : "View Details"}
            </button>
            <button
              onClick={() => setInvoiceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
            >
              <FileText className="w-3 h-3" />Invoice
            </button>
            <button
              onClick={() => setIssueOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 rounded-full text-amber-700 transition-colors"
            >
              <AlertCircle className="w-3 h-3" />Raise Issue
            </button>
            {canReturn && (
              <button
                onClick={() => setReturnOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 rounded-full text-rose-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />Return
              </button>
            )}
            {canCancel && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 rounded-full text-red-700 transition-colors">
                <XCircle className="w-3 h-3" />Cancel
              </button>
            )}
            <Link href="/collections">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/5 hover:bg-primary/10 rounded-full text-primary transition-colors">
                <RefreshCcw className="w-3 h-3" />Buy Again
              </button>
            </Link>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="border-t border-gray-100 bg-gray-50/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Delivery Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Delivery Timeline</h4>
                  <OrderTimeline order={order} />
                </div>

                {/* Right side details */}
                <div className="space-y-4">
                  {/* Shipment info */}
                  {order.courier && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipment Info</h4>
                      <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Courier</span>
                          <span className="font-semibold text-gray-800">{order.courier}</span>
                        </div>
                        {order.trackingId && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Tracking ID</span>
                            <span className="font-mono font-semibold text-primary text-[10px]">{order.trackingId}</span>
                          </div>
                        )}
                        {order.currentLocation && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />Location</span>
                            <span className="font-semibold text-gray-800">{order.currentLocation}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />Est. Delivery</span>
                            <span className="font-semibold text-gray-800">{formatDate(order.estimatedDelivery)}</span>
                          </div>
                        )}
                        {order.deliveryAgent && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Agent</span>
                            <span className="font-semibold text-gray-800 flex items-center gap-1">
                              {order.deliveryAgent}
                              {order.deliveryAgentPhone && (
                                <a href={`tel:${order.deliveryAgentPhone}`} className="text-primary">
                                  <Phone className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipping address */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                    <div className="bg-white rounded-xl p-3 border border-gray-100 text-xs text-gray-700 space-y-0.5">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                      <p className="flex items-center gap-1 text-gray-500 pt-0.5"><Phone className="w-2.5 h-2.5" />{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</h4>
                    <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Method</span>
                        <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                      </div>
                      {order.paymentId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID</span>
                          <span className="font-mono text-[9px] text-gray-600">{order.paymentId}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t border-gray-100 pt-1 mt-1">
                        <span className="text-gray-700">Total Paid</span>
                        <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Refund status */}
                  {order.refundStatus && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Refund Status</h4>
                      <div className={`rounded-xl p-3 border text-xs space-y-1 ${
                        order.refundStatus === "completed" ? "bg-green-50 border-green-200" :
                        order.refundStatus === "processing" ? "bg-amber-50 border-amber-200" :
                        "bg-gray-50 border-gray-200"
                      }`}>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-bold">{formatCurrency(order.refundAmount ?? order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method</span>
                          <span className="font-semibold">{order.refundMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-bold capitalize ${order.refundStatus === "completed" ? "text-green-700" : "text-amber-700"}`}>
                            {order.refundStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <IssueModal open={issueOpen} onClose={() => setIssueOpen(false)} order={order} />
      <ReturnModal open={returnOpen} onClose={() => setReturnOpen(false)} order={order} />
      <InvoiceModal open={invoiceOpen} onClose={() => setInvoiceOpen(false)} order={order} />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyOrders() {
  const [activeTab, setActiveTab] = useState<ExtendedOrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const orders = MOCK_ORDERS;

  const stats = useMemo(() => ({
    total: orders.length,
    delivered: orders.filter(o => o.status === "delivered").length,
    active: orders.filter(o => ["pending","confirmed","processing","shipped","out_for_delivery"].includes(o.status)).length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    returned: orders.filter(o => o.status === "returned").length,
  }), []);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (activeTab !== "all") list = list.filter(o => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q)) ||
        (o.trackingId ?? "").toLowerCase().includes(q)
      );
    }
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === "oldest") list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sort === "highest") list.sort((a, b) => b.totalAmount - a.totalAmount);
    if (sort === "lowest") list.sort((a, b) => a.totalAmount - b.totalAmount);
    return list;
  }, [orders, activeTab, search, sort]);

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pb-16 pt-24">
        {/* Page header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors mb-3">
              <ArrowLeft className="w-3.5 h-3.5" />Back to Home
            </button>
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5 font-body">Track, manage and return your orders</p>
            </div>
            <Package className="w-8 h-8 text-primary/30" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Orders"  value={stats.total}     icon={Package}      color="bg-primary"      delay={0} />
          <StatCard label="Delivered"     value={stats.delivered} icon={CheckCircle}  color="bg-green-500"    delay={0.07} />
          <StatCard label="Active"        value={stats.active}    icon={Truck}        color="bg-blue-500"     delay={0.14} />
          <StatCard label="Cancelled"     value={stats.cancelled} icon={XCircle}      color="bg-red-400"      delay={0.21} />
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, product or tracking number…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={`ml-1.5 text-[10px] ${activeTab === tab.key ? "opacity-70" : "text-gray-400"}`}>
                  {orders.filter(o => o.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary/30" />
              </div>
              <h3 className="font-display font-bold text-gray-800 text-lg mb-1">No orders found</h3>
              <p className="text-sm text-gray-400 mb-5">Try a different filter or start shopping!</p>
              <Link href="/collections">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {filtered.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
