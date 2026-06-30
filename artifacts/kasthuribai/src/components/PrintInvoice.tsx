import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer } from "lucide-react";
import { Order } from "@/store/use-orders";

interface Props {
  order: Order;
  onClose: () => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", packed: "Packed",
  shipped: "Shipped", out_for_delivery: "Out for Delivery",
  delivered: "Delivered", cancelled: "Cancelled", returned: "Returned", refunded: "Refunded",
};

export default function PrintInvoice({ order, onClose }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const scanUrl = `${window.location.origin}/scan/${order.id}`;

  const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);

  function handlePrint() {
    const el = invoiceRef.current;
    if (!el) return;

    const style = document.createElement("style");
    style.id = "kb-print-style";
    style.innerHTML = `
      @media print {
        body > *:not(#kb-print-portal) { display: none !important; }
        #kb-print-portal { position: fixed !important; inset: 0 !important; z-index: 99999 !important; background: white !important; display: block !important; }
        #kb-print-portal .no-print { display: none !important; }
        #kb-print-portal .print-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
      }
    `;
    document.head.appendChild(style);

    const portal = document.createElement("div");
    portal.id = "kb-print-portal";
    portal.innerHTML = el.innerHTML;
    document.body.appendChild(portal);

    window.print();

    document.head.removeChild(style);
    document.body.removeChild(portal);
  }

  const borderColor = "rgba(139,94,60,0.18)";
  const brandRed = "hsl(4,60%,38%)";
  const textDark = "hsl(18,18%,14%)";
  const textMid = "hsl(25,38%,45%)";
  const bgCream = "#FFF9F0";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "24px 16px",
      fontFamily: "Poppins, system-ui, sans-serif",
    }}>
      {/* Action bar */}
      <div className="no-print" style={{
        position: "fixed", top: 16, right: 16, display: "flex", gap: 8, zIndex: 1001,
      }}>
        <button onClick={handlePrint} style={{
          padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer",
          background: brandRed, color: "#fff", fontWeight: 700, fontSize: 14,
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          <Printer size={16} /> Print / Save PDF
        </button>
        <button onClick={onClose} style={{
          width: 40, height: 40, borderRadius: 10, border: "none", cursor: "pointer",
          background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <X size={18} />
        </button>
      </div>

      {/* Printable content */}
      <div ref={invoiceRef} style={{ maxWidth: 720, width: "100%" }}>

        {/* ── INVOICE PAGE ────────────────────────────────────────────── */}
        <div className="print-page" style={{
          background: "#fff", borderRadius: 16, marginBottom: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)", overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{ background: "hsl(4,60%,12%)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: bgCream, letterSpacing: "-0.01em" }}>KASTHURIBAI</p>
              <p style={{ fontSize: 11, color: "rgba(255,249,240,0.55)", marginTop: 2 }}>Company — NMP Readymades</p>
              <p style={{ fontSize: 10, color: "rgba(255,249,240,0.4)", marginTop: 1 }}>No. 1, Main Road, Cuddalore, Tamil Nadu - 607001</p>
              <p style={{ fontSize: 10, color: "rgba(255,249,240,0.4)" }}>GSTIN: 33NMPKB1234P1ZX</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: "rgba(255,249,240,0.12)", letterSpacing: "0.1em" }}>INVOICE</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: bgCream, marginTop: -4 }}>#{order.orderNumber}</p>
              <p style={{ fontSize: 11, color: "rgba(255,249,240,0.5)", marginTop: 4 }}>Date: {fmtDate(order.createdAt)}</p>
              <div style={{ marginTop: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(255,249,240,0.12)", display: "inline-block" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: bgCream }}>Status: {STATUS_LABELS[order.status] ?? order.status}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: "22px 28px" }}>

            {/* Customer + Order Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 22 }}>
              <div style={{ padding: 16, borderRadius: 12, background: bgCream, border: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: textMid, marginBottom: 8 }}>Bill To</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: textDark }}>{order.customerName}</p>
                <p style={{ fontSize: 12, color: textMid, marginTop: 3 }}>{order.customerPhone}</p>
                {order.customerEmail && <p style={{ fontSize: 12, color: textMid }}>{order.customerEmail}</p>}
                {order.gstNumber && <p style={{ fontSize: 11, color: textMid, marginTop: 4 }}>GSTIN: {order.gstNumber}</p>}
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: bgCream, border: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: textMid, marginBottom: 8 }}>Order Details</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    ["Order ID", order.id],
                    ["Payment", order.paymentMethod],
                    ...(order.razorpayPaymentId ? [["Txn ID", order.razorpayPaymentId]] : []),
                    ...(order.courier ? [["Courier", order.courier]] : []),
                    ...(order.trackingId ? [["Tracking", order.trackingId]] : []),
                    ...(order.estimatedDelivery ? [["Est. Delivery", new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })]] : []),
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: textMid, minWidth: 68, flexShrink: 0 }}>{k}:</p>
                      <p style={{ fontSize: 11, color: textDark, wordBreak: "break-all" }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ship To */}
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)", marginBottom: 22 }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2563eb", marginBottom: 5 }}>📦 Ship To</p>
              <p style={{ fontSize: 13, color: textDark }}>{order.customerName} · {order.customerPhone}</p>
              <p style={{ fontSize: 12, color: textMid, marginTop: 2 }}>{order.shippingAddress}</p>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
              <thead>
                <tr style={{ background: "hsl(4,60%,12%)" }}>
                  {["#", "Item Description", "Category", "Qty", "Unit Price", "Amount"].map((h, i) => (
                    <th key={h} style={{
                      padding: "9px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.07em", color: bgCream,
                      textAlign: i === 0 ? "center" : i >= 3 ? "right" : "left",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : bgCream }}>
                    <td style={{ padding: "9px 12px", fontSize: 12, textAlign: "center", color: textMid }}>{idx + 1}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: textDark }}>{item.name}</p>
                      {(item.size || item.color) && (
                        <p style={{ fontSize: 10, color: textMid, marginTop: 2 }}>
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: textMid }}>{item.category}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 700, textAlign: "right", color: textDark }}>{item.quantity}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, textAlign: "right", color: textMid }}>{fmt(item.price)}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 700, textAlign: "right", color: textDark }}>{fmt(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
              <div style={{ minWidth: 260 }}>
                {[
                  { label: "Subtotal", val: fmt(subtotal), bold: false },
                  ...(order.discount > 0 ? [{ label: "Discount", val: `− ${fmt(order.discount)}`, bold: false, red: true }] : []),
                  ...(order.shippingCharge > 0 ? [{ label: "Shipping", val: `+ ${fmt(order.shippingCharge)}`, bold: false }] : []),
                ].map(({ label, val, bold, red }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 12, color: textMid, fontWeight: bold ? 700 : 400 }}>{label}</span>
                    <span style={{ fontSize: 12, color: (red as boolean) ? "#dc2626" : textDark, fontWeight: bold ? 800 : 500 }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", marginTop: 6, background: "hsl(4,60%,12%)", borderRadius: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: bgCream }}>TOTAL</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: bgCream }}>{fmt(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer: QR + notes + thank you */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, borderTop: `1px dashed ${borderColor}`, paddingTop: 16 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: textDark, marginBottom: 4 }}>Thank you for shopping with Kasthuribai!</p>
                <p style={{ fontSize: 11, color: textMid }}>For queries: kasthuribaireadymades@gmail.com</p>
                {order.notes && (
                  <div style={{ marginTop: 8, padding: "7px 10px", borderRadius: 8, background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)" }}>
                    <p style={{ fontSize: 11, color: "#d97706" }}>Note: {order.notes}</p>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <QRCodeSVG value={scanUrl} size={80} bgColor="#fff" fgColor="hsl(4,60%,12%)" level="M" />
                <p style={{ fontSize: 9, color: textMid, marginTop: 4 }}>Scan to track / update</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── SHIPPING LABEL ───────────────────────────────────────────── */}
        <div className="print-page" style={{
          background: "#fff", borderRadius: 16, marginBottom: 32,
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)", overflow: "hidden",
          border: "2px dashed rgba(139,94,60,0.3)",
        }}>
          <div style={{ padding: "8px 16px", background: "hsl(4,60%,12%)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: bgCream, letterSpacing: "0.12em", textTransform: "uppercase" }}>✂  Shipping Label — Cut Here</p>
            <p style={{ fontSize: 11, color: "rgba(255,249,240,0.5)" }}>{order.orderNumber}</p>
          </div>

          <div style={{ padding: "18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

            {/* FROM / TO */}
            <div>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: textMid, marginBottom: 5 }}>From</p>
                <div style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${borderColor}`, background: bgCream }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: textDark }}>KASTHURIBAI READY MADES</p>
                  <p style={{ fontSize: 11, color: textMid, marginTop: 2 }}>Company — NMP Readymades</p>
                  <p style={{ fontSize: 11, color: textMid }}>No. 1, Main Road</p>
                  <p style={{ fontSize: 11, color: textMid }}>Cuddalore, Tamil Nadu - 607001</p>
                  <p style={{ fontSize: 11, color: textMid }}>Ph: +91 94400 00000</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: textMid, marginBottom: 5 }}>To</p>
                <div style={{ padding: "12px 14px", borderRadius: 10, border: `2px solid hsl(4,60%,38%)`, background: "#fff" }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: textDark }}>{order.customerName}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: textMid, marginTop: 2 }}>{order.customerPhone}</p>
                  <p style={{ fontSize: 12, color: textDark, marginTop: 6, lineHeight: 1.5 }}>{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* QR + Order Summary */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 12, border: `1.5px solid ${borderColor}`, background: bgCream, textAlign: "center" }}>
                <QRCodeSVG value={scanUrl} size={130} bgColor={bgCream} fgColor="hsl(4,60%,12%)" level="H" />
                <p style={{ fontSize: 9, color: textMid, marginTop: 6 }}>Scan to update order status</p>
              </div>

              <div style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: bgCream, border: `1px solid ${borderColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: textMid }}>Order #</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: textDark, fontFamily: "monospace" }}>{order.orderNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: textMid }}>Items</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: textDark }}>{order.items.reduce((s, i) => s + i.quantity, 0)} pcs</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: textMid }}>Amount</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: brandRed }}>{fmt(order.totalAmount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: textMid }}>Payment</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: textDark }}>{order.paymentMethod}</span>
                </div>
              </div>

              {order.courier && order.trackingId && (
                <div style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)" }}>
                  <p style={{ fontSize: 10, color: "#2563eb", fontWeight: 700 }}>{order.courier}</p>
                  <p style={{ fontSize: 11, fontFamily: "monospace", color: "#1e40af", fontWeight: 600 }}>{order.trackingId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
