import nodemailer from "nodemailer";
import { logger } from "./logger.js";

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    name: string;
    category?: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  createdAt: string;
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "465", 10);

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEmailHtml(d: OrderEmailData): string {
  const itemRows = d.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f3ede0;">
          <div style="font-family:'Georgia',serif;font-size:14px;font-weight:600;color:#2d1a00;">${item.name}</div>
          ${item.category ? `<div style="font-size:11px;color:#a08050;margin-top:2px;">${item.category}</div>` : ""}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f3ede0;text-align:center;font-size:13px;color:#5a3e1b;">×${item.quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f3ede0;text-align:right;font-size:14px;font-weight:600;color:#2d1a00;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const total = d.totalAmount.toLocaleString("en-IN");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Order Confirmed — Kasthuribai</title>
</head>
<body style="margin:0;padding:0;background:#fdf6ec;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ec;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(180,120,20,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a0800 0%,#3d1c00 60%,#1a0800 100%);padding:40px 40px 32px;text-align:center;">
            <!-- Gold shimmer bar -->
            <div style="height:3px;background:linear-gradient(90deg,transparent,#d4a730,#f0c94a,#d4a730,transparent);border-radius:2px;margin-bottom:28px;"></div>
            <div style="font-family:'Georgia',serif;font-size:30px;font-weight:700;color:#f0c94a;letter-spacing:2px;">KASTHURIBAI</div>
            <div style="font-size:10px;color:#a08050;letter-spacing:4px;text-transform:uppercase;margin-top:4px;">Company · NMP Readymades</div>
            <div style="margin-top:24px;">
              <div style="display:inline-block;background:rgba(212,167,48,0.15);border:1px solid rgba(212,167,48,0.35);border-radius:50px;padding:8px 22px;">
                <span style="font-size:13px;color:#f0c94a;font-weight:600;letter-spacing:1px;">✦ Order Confirmed ✦</span>
              </div>
            </div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 40px 24px;">
            <p style="margin:0 0 8px;font-size:22px;font-family:'Georgia',serif;color:#2d1a00;font-weight:700;">Namaste, ${d.customerName}! 🙏</p>
            <p style="margin:0;font-size:15px;color:#7a5c30;line-height:1.7;">
              Thank you for shopping at Kasthuribai. Your order has been confirmed and our team is already preparing it with care. We'll keep you updated every step of the way.
            </p>
          </td>
        </tr>

        <!-- Order summary card -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#fdf6ec;border:1px solid #f0e0b8;border-radius:14px;padding:20px 24px;">
              <div style="font-size:11px;color:#a08050;letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:14px;">Order Details</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#7a5c30;">Order ID</td>
                  <td style="padding:4px 0;font-size:13px;color:#2d1a00;font-weight:600;text-align:right;font-family:monospace;">${d.orderId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#7a5c30;">Payment ID</td>
                  <td style="padding:4px 0;font-size:11px;color:#5a3e1b;text-align:right;font-family:monospace;">${d.razorpayPaymentId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#7a5c30;">Date & Time</td>
                  <td style="padding:4px 0;font-size:13px;color:#2d1a00;font-weight:500;text-align:right;">${formatDate(d.createdAt)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#7a5c30;">Phone</td>
                  <td style="padding:4px 0;font-size:13px;color:#2d1a00;text-align:right;">${d.customerPhone}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- Items table -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="font-size:11px;color:#a08050;letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:14px;">Items Ordered</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e0b8;border-radius:12px;overflow:hidden;">
              <thead>
                <tr style="background:#fdf6ec;">
                  <th style="padding:10px 16px;font-size:11px;color:#a08050;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Item</th>
                  <th style="padding:10px 16px;font-size:11px;color:#a08050;text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                  <th style="padding:10px 16px;font-size:11px;color:#a08050;text-align:right;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
                <tr style="background:#fdf6ec;">
                  <td colspan="2" style="padding:14px 16px;font-family:'Georgia',serif;font-size:15px;font-weight:700;color:#2d1a00;">Total Paid</td>
                  <td style="padding:14px 16px;text-align:right;font-family:'Georgia',serif;font-size:18px;font-weight:700;color:#c8860a;">₹${total}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Shipping address -->
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="background:#fff8ee;border:1px solid #f0e0b8;border-left:4px solid #d4a730;border-radius:12px;padding:18px 20px;">
              <div style="font-size:11px;color:#a08050;letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px;">📦 Shipping To</div>
              <div style="font-size:14px;color:#2d1a00;font-weight:600;">${d.customerName}</div>
              <div style="font-size:13px;color:#7a5c30;margin-top:4px;line-height:1.6;">${d.shippingAddress}</div>
            </div>
          </td>
        </tr>

        <!-- Order journey -->
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="font-size:11px;color:#a08050;letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:16px;">Your Order Journey</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                { step: "✅", label: "Order Confirmed", active: true  },
                { step: "🔄", label: "Processing",      active: false },
                { step: "📦", label: "Packed & Ready",  active: false },
                { step: "🚚", label: "Shipped",         active: false },
                { step: "🎉", label: "Delivered",       active: false },
              ]
                .map(
                  (s) => `
              <tr>
                <td style="width:36px;padding:6px 0;">
                  <div style="width:32px;height:32px;border-radius:50%;background:${s.active ? "linear-gradient(135deg,#d4a730,#f0c94a)" : "#f0e0b8"};display:flex;align-items:center;justify-content:center;font-size:14px;text-align:center;line-height:32px;">${s.step}</div>
                </td>
                <td style="padding:6px 12px;font-size:14px;color:${s.active ? "#c8860a" : "#b0966a"};font-weight:${s.active ? "700" : "400"};">${s.label}</td>
                ${s.active ? '<td style="padding:6px 0;text-align:right;"><span style="background:#d4a730;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:1px;">CURRENT</span></td>' : "<td></td>"}
              </tr>`
                )
                .join("")}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 36px;text-align:center;">
            <a href="https://kasthuribai.in/track-order" style="display:inline-block;background:linear-gradient(135deg,#d4a730,#f0c94a);color:#1a0800;font-family:'Georgia',serif;font-size:14px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;letter-spacing:1px;">
              Track My Order →
            </a>
            <p style="margin:16px 0 0;font-size:12px;color:#b0966a;">Questions? WhatsApp us: <a href="https://wa.me/919876543210" style="color:#d4a730;text-decoration:none;font-weight:600;">+91 98765 43210</a></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a0800,#2d1200);padding:28px 40px;text-align:center;">
            <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,167,48,0.4),transparent);margin-bottom:20px;"></div>
            <div style="font-size:12px;color:#a08050;line-height:1.8;">
              <strong style="color:#d4a730;">Kasthuribai — NMP Group</strong><br/>
              Chidambaram, Tamil Nadu, India<br/>
              <a href="mailto:kasthuribai@gmail.com" style="color:#d4a730;text-decoration:none;">kasthuribai@gmail.com</a>
            </div>
            <p style="margin:16px 0 0;font-size:11px;color:#6b4a20;">Since 1930s · Trusted by 1000+ families · 90+ Years of Excellence</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn("Email not configured — skipping order confirmation email (set EMAIL_USER and EMAIL_APP_PASSWORD)");
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Kasthuribai — NMP Group" <${process.env.EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `✦ Order Confirmed — ${data.orderId} | Kasthuribai`,
      html: buildEmailHtml(data),
      text: `Order ${data.orderId} confirmed! Total: ₹${data.totalAmount.toLocaleString("en-IN")}. Thank you, ${data.customerName}!`,
    });

    logger.info({ messageId: info.messageId, to: data.customerEmail, orderId: data.orderId }, "Order confirmation email sent");
    return true;
  } catch (err) {
    logger.error({ err, orderId: data.orderId }, "Failed to send order confirmation email");
    return false;
  }
}
