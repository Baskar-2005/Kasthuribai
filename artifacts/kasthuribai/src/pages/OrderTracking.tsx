import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useOrders, Order, OrderStatus } from "@/store/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export default function OrderTracking() {
  const [, params] = useRoute("/order-tracking/:orderId");
  const [, setLocation] = useLocation();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (params?.orderId) {
      const foundOrder = getOrderById(params.orderId);
      setOrder(foundOrder || null);
    }
  }, [params?.orderId, getOrderById]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (!order) return 0;
    if (order.status === "cancelled") return 100;
    const currentIndex = statusOrder.indexOf(order.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <Card className="border-amber-200 max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto text-amber-300 mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-amber-600 mb-4">
              We couldn't find the order you're looking for.
            </p>
            <Button
              onClick={() => setLocation("/my-orders")}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              View My Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/my-orders")}
              className="hover:bg-amber-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Order Tracking</h1>
              <p className="text-sm text-amber-600">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-900">Order Status</CardTitle>
                  <Badge className={statusConfig[order.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {order.status === "cancelled" ? (
                  <div className="text-center py-8">
                    <XCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">
                      Order Cancelled
                    </h3>
                    <p className="text-red-600">
                      This order has been cancelled.
                    </p>
                  </div>
                ) : (
                  <>
                    <Progress value={getProgressPercentage()} className="h-2 mb-6" />
                    <div className="space-y-4">
                      {order.trackingSteps.map((step, index) => {
                        const StepIcon = statusConfig[step.status].icon;
                        return (
                          <div
                            key={step.status}
                            className={`flex items-start gap-4 p-4 rounded-lg ${
                              step.completed
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full ${
                                step.completed
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <StepIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`font-medium ${
                                    step.completed ? "text-green-900" : "text-gray-500"
                                  }`}
                                >
                                  {step.label}
                                </h4>
                                {step.completed && step.timestamp && (
                                  <span className="text-xs text-green-600">
                                    {formatDate(step.timestamp)}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-sm ${
                                  step.completed ? "text-green-700" : "text-gray-400"
                                }`}
                              >
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

            {/* Order Items */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900">{item.name}</h4>
                        <p className="text-sm text-amber-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-amber-800">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Order ID</span>
                  <span className="font-mono text-amber-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Order Date</span>
                  <span className="text-amber-900">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Payment ID</span>
                  <span className="font-mono text-amber-900 text-xs">
                    {order.razorpayPaymentId?.slice(-12) || "—"}
                  </span>
                </div>
                <Separator className="bg-amber-100" />
                <div className="flex justify-between font-semibold">
                  <span className="text-amber-900">Total Amount</span>
                  <span className="text-amber-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Details */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Shipping Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      {order.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700">{order.shippingAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <Button
                  onClick={() => setLocation("/my-orders")}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
