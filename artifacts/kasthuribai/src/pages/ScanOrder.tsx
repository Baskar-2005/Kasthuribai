import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useOrders, OrderStatus } from "@/store/use-orders";
import { CheckCircle2, Package, Truck, XCircle, Clock, ArrowRight, ShoppingBag, AlertTriangle } from "lucide-react";

const ADVANCE_MAP: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: "packed",
  packed:    "shipped",
  shipped:   "out_for_delivery",
  out_for_delivery: "delivered",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  packed:           "Packed",
  shipped:          "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
  returned:         "Returned",
  refunded:         "Refunded",
};

const STATUS_ICONS: Partial<Record<OrderStatus, React.ElementType>> = {
  pending:          Clock,
  confirmed:        CheckCircle2,
  packed:           Package,
  shipped:          Truck,
  out_for_delivery: Truck,
  delivered:        CheckCircle2,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:          "#d97706",
  confirmed:        "#2563eb",
  packed:           "#7c3aed",
  shipped:          "#6d28d9",
  out_for_delivery: "#ea580c",
  delivered:        "#16a34a",
  cancelled:        "#dc2626",
  returned:         "#be123c",
  refunded:         "#0d9488",
};

type ScanState = "loading" | "advancing" | "done" | "no_advance" | "not_found";

export default function ScanOrder() {
  const [, params] = useRoute("/scan/:orderId");
  const [, setLocation] = useLocation();
  const { getOrderById, updateOrderStatus, seedIfEmpty } = useOrders();

  const [state, setState] = useState<ScanState>("loading");
  const [orderInfo, setOrderInfo] = useState<{ id: string; name: string; number: string; prevStatus: OrderStatus; nextStatus: OrderStatus | null } | null>(null);

  useEffect(() => {
    seedIfEmpty();
    setTimeout(() => {
      const orderId = params?.orderId;
      if (!orderId) { setState("not_found"); return; }
      const order = getOrderById(orderId);
      if (!order) { setState("not_found"); return; }
      const next = ADVANCE_MAP[order.status] ?? null;
      setOrderInfo({ id: order.id, name: order.customerName, number: order.orderNumber, prevStatus: order.status, nextStatus: next });
      if (!next) { setState("no_advance"); return; }
      setState("advancing");
      setTimeout(() => {
        updateOrderStatus(orderId, next);
        setState("done");
      }, 1800);
    }, 300);
  }, [params?.orderId]);

  const brandBar = (
    <div style={{ background: "hsl(4,60%,12%)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,249,240,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ShoppingBag size={20} color="#FFF9F0" />
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#FFF9F0", lineHeight: 1 }}>Kasthuribai</p>
        <p style={{ fontSize: 11, color: "rgba(255,249,240,0.5)", marginTop: 2 }}>Ready Mades — Order Scanner</p>
      </div>
    </div>
  );

  const baseStyle: React.CSSProperties = {
    minHeight: "100vh", background: "hsl(30,60%,96%)", fontFamily: "Poppins,system-ui,sans-serif",
    display: "flex", flexDirection: "column",
  };

  if (state === "loading") {
    return (
      <div style={baseStyle}>
        {brandBar}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid rgba(139,94,60,0.2)", borderTopColor: "hsl(4,60%,44%)", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "hsl(25,38%,50%)", fontWeight: 600 }}>Loading order…</p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state === "not_found") {
    return (
      <div style={baseStyle}>
        {brandBar}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 320 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <XCircle size={36} color="#dc2626" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "hsl(18,18%,14%)", marginBottom: 8 }}>Order Not Found</h2>
            <p style={{ color: "hsl(25,38%,50%)", fontSize: 14, marginBottom: 28 }}>This QR code doesn't match any order in the system.</p>
            <button onClick={() => setLocation("/admin")} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "hsl(4,60%,44%)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Go to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "no_advance" && orderInfo) {
    const Icon = STATUS_ICONS[orderInfo.prevStatus] ?? Package;
    const color = STATUS_COLORS[orderInfo.prevStatus];
    return (
      <div style={baseStyle}>
        {brandBar}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 360, background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(139,94,60,0.1)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon size={36} color={color} />
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 6 }}>Order #{orderInfo.number}</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "hsl(18,18%,14%)", marginBottom: 8 }}>{STATUS_LABELS[orderInfo.prevStatus]}</h2>
            <p style={{ color: "hsl(25,38%,50%)", fontSize: 14, marginBottom: 8 }}>{orderInfo.name}</p>
            <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", marginTop: 16, marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <AlertTriangle size={14} color="#d97706" />
                <p style={{ fontSize: 13, color: "#d97706", fontWeight: 600 }}>This order cannot be advanced further</p>
              </div>
            </div>
            <button onClick={() => setLocation("/admin")} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "hsl(4,60%,44%)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Go to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if ((state === "advancing" || state === "done") && orderInfo && orderInfo.nextStatus) {
    const fromColor = STATUS_COLORS[orderInfo.prevStatus];
    const toColor = STATUS_COLORS[orderInfo.nextStatus];
    const ToIcon = STATUS_ICONS[orderInfo.nextStatus] ?? Package;
    const done = state === "done";

    return (
      <div style={baseStyle}>
        {brandBar}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 380, width: "100%" }}>

            {/* Order info card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(139,94,60,0.1)", marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(25,38%,50%)", marginBottom: 4 }}>Order #{orderInfo.number}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "hsl(18,18%,14%)", marginBottom: 4 }}>{orderInfo.name}</p>
              <p style={{ fontSize: 12, color: "hsl(25,38%,55%)", marginBottom: 24 }}>{orderInfo.id}</p>

              {/* Status transition */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${fromColor}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", opacity: done ? 0.4 : 1, transition: "opacity 0.8s" }}>
                    {(() => { const F = STATUS_ICONS[orderInfo.prevStatus] ?? Package; return <F size={22} color={fromColor} />; })()}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: fromColor, opacity: done ? 0.4 : 1, transition: "opacity 0.8s" }}>{STATUS_LABELS[orderInfo.prevStatus]}</p>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ height: 2, width: "100%", background: done ? toColor : "rgba(139,94,60,0.2)", transition: "background 0.8s", borderRadius: 2 }} />
                  <ArrowRight size={16} color={done ? toColor : "rgba(139,94,60,0.3)"} style={{ transition: "color 0.8s" }} />
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: done ? `${toColor}20` : "rgba(139,94,60,0.06)", border: done ? `2px solid ${toColor}` : "2px dashed rgba(139,94,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", transition: "all 0.8s" }}>
                    <ToIcon size={22} color={done ? toColor : "rgba(139,94,60,0.3)"} style={{ transition: "color 0.8s" }} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: done ? toColor : "rgba(139,94,60,0.4)", transition: "color 0.8s" }}>{STATUS_LABELS[orderInfo.nextStatus]}</p>
                </div>
              </div>
            </div>

            {/* Status message */}
            {!done ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "18px 24px", boxShadow: "0 2px 12px rgba(139,94,60,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(139,94,60,0.2)", borderTopColor: "hsl(4,60%,44%)", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(18,18%,24%)" }}>Updating status…</p>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, padding: "18px 24px", boxShadow: "0 2px 12px rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <CheckCircle2 size={28} color="#16a34a" />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#16a34a" }}>Status Updated!</p>
                    <p style={{ fontSize: 12, color: "hsl(25,38%,55%)" }}>Order is now <strong>{STATUS_LABELS[orderInfo.nextStatus]}</strong></p>
                  </div>
                </div>
                <button onClick={() => setLocation("/admin")} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: "hsl(4,60%,44%)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Back to Admin Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return null;
}
