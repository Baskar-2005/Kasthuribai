import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useOrders, Order, OrderStatus } from "@/store/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  User,
  Search,
  RefreshCw,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending:          { label: "Pending",          color: "text-yellow-700",  bg: "bg-yellow-100",   icon: Clock },
  confirmed:        { label: "Confirmed",        color: "text-blue-700",    bg: "bg-blue-100",     icon: CheckCircle },
  packed:           { label: "Packed",           color: "text-purple-700",  bg: "bg-purple-100",   icon: Package },
  shipped:          { label: "Shipped",          color: "text-indigo-700",  bg: "bg-indigo-100",   icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-700",  bg: "bg-orange-100",   icon: Truck },
  delivered:        { label: "Delivered",        color: "text-green-700",   bg: "bg-green-100",    icon: CheckCircle },
  cancelled:        { label: "Cancelled",        color: "text-red-700",     bg: "bg-red-100",      icon: XCircle },
  returned:         { label: "Returned",         color: "text-rose-700",    bg: "bg-rose-100",     icon: RotateCcw },
  refunded:         { label: "Refunded",         color: "text-teal-700",    bg: "bg-teal-100",     icon: CheckCircle },
};

const statusOrder: OrderStatus[] = [
  "pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered",
];

function getProgressPercentage(status: OrderStatus) {
  if (status === "cancelled" || status === "returned" || status === "refunded") return 100;
  const idx = statusOrder.indexOf(status);
  return idx < 0 ? 0 : ((idx + 1) / statusOrder.length) * 100;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-amber-100 rounded-2xl p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-amber-900 text-sm">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
              <StatusIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-amber-600 mt-1">{order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatCurrency(order.totalAmount)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Placed {formatDate(order.createdAt)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-1" />
      </div>
    </motion.div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.icon;
  const progress = getProgressPercentage(order.status);
  const isFinal = ["cancelled", "returned", "refunded"].includes(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-amber-700 hover:bg-amber-50 rounded-xl -ml-2"
        >
          ← Back to results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Status card */}
          <Card className="border-amber-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-amber-900 text-base">Order Status</CardTitle>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {cfg.label}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isFinal && order.status === "cancelled" ? (
                <div className="text-center py-8">
                  <XCircle className="h-14 w-14 mx-auto text-red-300 mb-3" />
                  <h3 className="font-semibold text-red-800 mb-1">Order Cancelled</h3>
                  <p className="text-red-600 text-sm">This order has been cancelled.</p>
                  {order.refundAmount && (
                    <p className="text-green-700 text-sm mt-2">
                      Refund of {formatCurrency(order.refundAmount)} via {order.refundMethod}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <Progress value={progress} className="h-2 mb-5" />
                  <div className="space-y-3">
                    {order.trackingSteps.map((step) => {
                      const StepIcon = statusConfig[step.status as OrderStatus]?.icon ?? Package;
                      return (
                        <div
                          key={step.status}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${
                            step.completed
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div className={`p-1.5 rounded-full flex-shrink-0 ${step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className={`font-medium text-sm ${step.completed ? "text-green-900" : "text-gray-400"}`}>
                                {step.label}
                              </span>
                              {step.completed && step.timestamp && (
                                <span className="text-[11px] text-green-600">{formatDate(step.timestamp)}</span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${step.completed ? "text-green-700" : "text-gray-400"}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping info */}
          {(order.courier || order.trackingId || order.currentLocation) && (
            <Card className="border-amber-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-900 text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Shipment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {order.courier && <div className="flex justify-between"><span className="text-amber-600">Courier</span><span className="text-amber-900 font-medium">{order.courier}</span></div>}
                {order.trackingId && <div className="flex justify-between"><span className="text-amber-600">Tracking ID</span><span className="font-mono text-amber-900">{order.trackingId}</span></div>}
                {order.currentLocation && <div className="flex justify-between"><span className="text-amber-600">Current Location</span><span className="text-amber-900">{order.currentLocation}</span></div>}
                {order.currentHub && <div className="flex justify-between"><span className="text-amber-600">Hub</span><span className="text-amber-900">{order.currentHub}</span></div>}
                {order.estimatedDelivery && <div className="flex justify-between"><span className="text-amber-600">Est. Delivery</span><span className="text-amber-900 font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span></div>}
                {order.deliveryAgent && (
                  <>
                    <Separator className="bg-amber-100" />
                    <div className="flex justify-between"><span className="text-amber-600">Delivery Agent</span><span className="text-amber-900">{order.deliveryAgent}</span></div>
                    {order.deliveryAgentPhone && <div className="flex justify-between"><span className="text-amber-600">Agent Phone</span><span className="text-amber-900">{order.deliveryAgentPhone}</span></div>}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order items */}
          <Card className="border-amber-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-900 text-base">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-amber-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-amber-900 text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Qty {item.quantity}
                        {item.size && ` · ${item.size}`}
                        {item.color && ` · ${item.color}`}
                      </p>
                      <p className="text-sm font-semibold text-amber-800 mt-0.5">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="border-amber-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-900 text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-amber-600">Order ID</span><span className="font-mono text-amber-900">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-amber-600">Placed On</span><span className="text-amber-900">{formatDate(order.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-amber-600">Payment</span><span className="text-amber-900">{order.paymentMethod}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-amber-600">Discount</span><span className="text-green-700">−{formatCurrency(order.discount)}</span></div>}
              {order.shippingCharge > 0 && <div className="flex justify-between"><span className="text-amber-600">Shipping</span><span className="text-amber-900">{formatCurrency(order.shippingCharge)}</span></div>}
              <Separator className="bg-amber-100" />
              <div className="flex justify-between font-bold"><span className="text-amber-900">Total</span><span className="text-amber-900">{formatCurrency(order.totalAmount)}</span></div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-900 text-base">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-900 font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-700">{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-700 leading-snug">{order.shippingAddress}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="pt-5 text-center">
              <p className="text-xs text-amber-600 mb-3">Need help with your order?</p>
              <a
                href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20order%20%23"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> WhatsApp Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrackOrder() {
  const [, setLocation] = useLocation();
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
      const idMatch = o.id.toLowerCase().includes(q) || o.orderNumber?.toLowerCase().includes(q);
      const phoneMatch = o.customerPhone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
      return idMatch || phoneMatch;
    });

    setResults(matches);
    setSearched(true);
    setSelected(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleReset = () => {
    setQuery("");
    setSearched(false);
    setResults([]);
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/60 to-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 mb-4">
            <Package className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 font-display">Track Your Order</h1>
          <p className="text-amber-600 mt-2 text-sm">
            Enter your Order ID (e.g. KB25001) or registered phone number to see live status
          </p>
        </div>

        {/* Search box */}
        <Card className="border-amber-200 shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Order ID (KB25001) or phone number..."
                  className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-300 bg-amber-50/50 h-11 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 px-6 font-semibold flex-1 sm:flex-none"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
                {searched && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl h-11 px-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-amber-500 mt-3">
              💡 Try: <button className="underline hover:text-amber-700" onClick={() => setQuery("KB25001")}>KB25001</button>,{" "}
              <button className="underline hover:text-amber-700" onClick={() => setQuery("KB25002")}>KB25002</button>, or your phone number
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence mode="wait">
          {selected ? (
            <OrderDetail key="detail" order={selected} onBack={() => setSelected(null)} />
          ) : searched ? (
            <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {results.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 mx-auto text-amber-200 mb-4" />
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">No orders found</h3>
                  <p className="text-amber-600 text-sm mb-6 max-w-sm mx-auto">
                    We couldn't find any orders matching <strong>"{query}"</strong>. Check the Order ID or phone number and try again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleReset} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl">
                      Try Again
                    </Button>
                    <Button onClick={() => setLocation("/my-orders")} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                      View My Orders
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-amber-700 font-medium mb-4">
                    Found {results.length} order{results.length > 1 ? "s" : ""}
                    {results.length > 1 && " — tap one to see details"}
                  </p>
                  <div className="space-y-3">
                    {results.length === 1 ? (
                      <OrderDetail order={results[0]} onBack={handleReset} />
                    ) : (
                      results.map((order) => (
                        <OrderCard key={order.id} order={order} onClick={() => setSelected(order)} />
                      ))
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Package, title: "Order ID", desc: "Find your Order ID in the confirmation SMS or email (e.g. KB25001)" },
                { icon: Phone, title: "Phone Number", desc: "Use the mobile number you placed the order with" },
                { icon: Truck, title: "Live Updates", desc: "See real-time status from order placed to delivery at your door" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-amber-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-amber-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
