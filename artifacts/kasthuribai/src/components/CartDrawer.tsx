import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, MessageCircle, CreditCard, Smartphone, ChevronRight, ChevronDown, Trash2, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { useOrders, defaultTrackingSteps } from "@/store/use-orders";
import { createRazorpayOrder, initializePayment, verifyPayment, CustomerDetails } from "@/lib/razorpay";
import { useLocation } from "wouter";

type PaymentStep = "cart" | "checkout";
type PaymentMethod = "upi" | "card" | "whatsapp" | "razorpay" | null;

function UPIPanel({ total, onClose }: { total: number; onClose: () => void }) {
  const [upiId, setUpiId] = useState("");
  const [paid, setPaid] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Smartphone className="w-4 h-4 text-purple-600" />
        <span className="font-body font-bold text-sm text-purple-700">Pay via UPI</span>
      </div>
      <p className="text-xs font-body text-purple-600">UPI ID: <span className="font-bold select-all">kasthuribai@ybl</span></p>
      <div className="bg-white rounded-xl p-3 text-center border border-purple-100">
        <div className="text-4xl mb-1">📱</div>
        <p className="text-xs text-gray-500 font-body">Scan the QR code at our store</p>
        <p className="text-lg font-bold font-body text-purple-700 mt-1">{formatPrice(total)}</p>
      </div>
      <input
        type="text"
        placeholder="Enter your UPI ID to confirm"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className="w-full border border-purple-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-purple-300 bg-white"
      />
      {!paid ? (
        <button
          onClick={() => { if (upiId.trim()) setPaid(true); }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-body font-bold py-3 rounded-xl text-sm transition-colors"
        >
          Confirm Payment
        </button>
      ) : (
        <div className="flex items-center gap-2 justify-center text-green-600 font-body font-bold text-sm py-2">
          <CheckCircle2 className="w-5 h-5" /> Payment request sent! Our team will confirm.
        </div>
      )}
    </motion.div>
  );
}

function CardPanel({ total, onClose }: { total: number; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    if (form.name && form.number && form.expiry && form.cvv) setPaid(true);
  };

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="w-4 h-4 text-blue-600" />
        <span className="font-body font-bold text-sm text-blue-700">Pay by Card</span>
        <Lock className="w-3 h-3 text-blue-400 ml-auto" />
      </div>

      {!paid ? (
        <>
          <input
            placeholder="Cardholder Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          />
          <input
            placeholder="Card Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: formatCardNumber(e.target.value) })}
            maxLength={19}
            className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-blue-300 bg-white tracking-widest"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="MM / YY"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              maxLength={5}
              className="border border-blue-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
            <input
              placeholder="CVV"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              maxLength={3}
              type="password"
              className="border border-blue-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
          </div>
          <button
            onClick={handlePay}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-body font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Pay {formatPrice(total)}
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2 justify-center text-green-600 font-body font-bold text-sm py-4">
          <CheckCircle2 className="w-5 h-5" /> Payment confirmed! Order placed.
        </div>
      )}
    </motion.div>
  );
}

function RazorpayPanel({ total, items, onClose }: { total: number; items: any[]; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addOrder } = useOrders();
  const { clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const customerDetails: CustomerDetails = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      // Create order
      const order = await createRazorpayOrder(total, items, customerDetails);

      // Initialize payment
      await initializePayment(
        order,
        customerDetails,
        async (paymentDetails) => {
          // Verify payment
          const isVerified = await verifyPayment(paymentDetails);

          if (isVerified) {
            // Create order in store
            const newOrder = {
              id: `order_${Date.now()}`,
              razorpayOrderId: paymentDetails.razorpay_order_id,
              razorpayPaymentId: paymentDetails.razorpay_payment_id,
              items: items,
              totalAmount: total,
              status: "confirmed" as const,
              customerName: form.name,
              customerEmail: form.email,
              customerPhone: form.phone,
              shippingAddress: form.address,
              trackingSteps: defaultTrackingSteps.map((step) => ({
                ...step,
                timestamp: step.status === "confirmed" ? new Date().toISOString() : null,
                completed: step.status === "confirmed",
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            addOrder(newOrder);
            clearCart();
            onClose();
            setLocation(`/order-tracking/${newOrder.id}`);
          } else {
            setError("Payment verification failed. Please try again.");
          }
          setLoading(false);
        },
        (error) => {
          setError(error.message || "Payment failed. Please try again.");
          setLoading(false);
        }
      );
    } catch (err: any) {
      setError(err.message || "Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="w-4 h-4 text-green-600" />
        <span className="font-body font-bold text-sm text-green-700">Pay with Razorpay</span>
        <Lock className="w-3 h-3 text-green-400 ml-auto" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          {error.includes("server") && (
            <p className="mt-2 text-xs text-red-500">
              Make sure the API server is running on port 8080.
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-green-300 bg-white"
        />
        <input
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-green-300 bg-white"
        />
        <input
          placeholder="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-green-300 bg-white"
        />
        <textarea
          placeholder="Shipping Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={3}
          className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-green-300 bg-white resize-none"
        />
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-body font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </button>
    </motion.div>
  );
}

export function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<PaymentStep>("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handleClose = () => {
    setIsOpen(false);
    setStep("cart");
    setPaymentMethod(null);
  };

  const handleWhatsAppOrder = () => {
    let message = `Hello! I'd like to place an order from Kasthuribai Ready Mades:\n\n`;
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\n*Total: ${formatPrice(grandTotal)}*\n\nPlease confirm availability and delivery.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
  };

  const selectPayment = (method: PaymentMethod) => {
    setPaymentMethod((prev) => (prev === method ? null : method));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-body font-bold text-base leading-tight">
                    {step === "cart" ? "Shopping Bag" : "Checkout"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-body">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {step === "checkout" && (
                  <button onClick={() => setStep("cart")} className="text-xs font-body text-primary underline underline-offset-2">
                    ← Back
                  </button>
                )}
                <button onClick={handleClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-8 py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-base text-foreground">Your bag is empty</p>
                    <p className="text-sm text-muted-foreground font-body mt-1">Explore our collections and add items.</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="bg-primary text-white font-body font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {/* Free shipping indicator */}
                  {total < 999 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-sm">🚚</span>
                      <p className="text-xs font-body text-amber-700">
                        Add <span className="font-bold">{formatPrice(999 - total)}</span> more for free shipping!
                      </p>
                      <div className="ml-auto w-16 h-1.5 bg-amber-100 rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((total / 999) * 100, 100)}%` }} />
                      </div>
                    </div>
                  )}
                  {total >= 999 && (
                    <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                      <p className="text-xs font-body text-green-700 font-semibold">🎉 You've unlocked free shipping!</p>
                    </div>
                  )}

                  {/* Items */}
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-3 bg-gray-50 rounded-2xl p-3"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-body font-semibold text-xs text-foreground line-clamp-2 leading-tight flex-1">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-300 hover:text-rose-400 transition-colors flex-shrink-0 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] text-primary font-body font-semibold uppercase mt-0.5">{item.category}</span>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-body font-bold text-sm text-foreground">{formatPrice(item.price * item.quantity)}</span>
                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-1 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-body font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Checkout step: payment options */}
                  {step === "checkout" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-2"
                    >
                      <p className="text-xs font-body font-bold text-muted-foreground uppercase tracking-wider px-1">Select Payment Method</p>

                      {/* UPI */}
                      <div className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => selectPayment("upi")}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${paymentMethod === "upi" ? "bg-purple-50" : "bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-body font-bold text-sm text-foreground">UPI Payment</p>
                            <p className="text-[10px] text-muted-foreground font-body">GPay, PhonePe, Paytm & more</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${paymentMethod === "upi" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {paymentMethod === "upi" && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4">
                                <UPIPanel total={grandTotal} onClose={handleClose} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Card */}
                      <div className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => selectPayment("card")}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${paymentMethod === "card" ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-body font-bold text-sm text-foreground">Credit / Debit Card</p>
                            <p className="text-[10px] text-muted-foreground font-body">Visa, Mastercard, RuPay</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${paymentMethod === "card" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {paymentMethod === "card" && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4">
                                <CardPanel total={grandTotal} onClose={handleClose} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Razorpay */}
                      <div className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => selectPayment("razorpay")}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${paymentMethod === "razorpay" ? "bg-green-50" : "bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-body font-bold text-sm text-foreground">Pay with Razorpay</p>
                            <p className="text-[10px] text-muted-foreground font-body">Cards, UPI, Netbanking & more</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${paymentMethod === "razorpay" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {paymentMethod === "razorpay" && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4">
                                <RazorpayPanel total={grandTotal} items={items} onClose={handleClose} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* WhatsApp */}
                      <button
                        onClick={handleWhatsAppOrder}
                        className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#25D366] hover:bg-[#22c55e] text-white rounded-2xl transition-colors"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-body font-bold text-sm">Order via WhatsApp</p>
                          <p className="text-[10px] text-white/80 font-body">Chat with us to place your order</p>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 bg-white space-y-3">
                {/* Price breakdown */}
                <div className="space-y-1.5 text-sm font-body">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-foreground border-t border-gray-100 pt-2 mt-2">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {step === "cart" ? (
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-body font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <p className="text-center text-[11px] font-body text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Secure checkout — your data is protected
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
