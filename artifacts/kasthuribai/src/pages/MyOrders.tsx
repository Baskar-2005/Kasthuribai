import { useState } from "react";
import { useLocation } from "wouter";
import { useOrders, Order, OrderStatus } from "@/store/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock, XCircle, Search, ArrowLeft } from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { orders } = useOrders();
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const handleSearch = () => {
    if (email.trim()) {
      const userOrders = orders.filter(
        (order) => order.customerEmail.toLowerCase() === email.toLowerCase()
      );
      setFilteredOrders(userOrders);
      setSearchedEmail(email);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    setLocation(`/order-tracking/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="hover:bg-amber-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">My Orders</h1>
              <p className="text-sm text-amber-600">Track and manage your orders</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email" className="text-amber-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Search Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {searchedEmail && (
          <div>
            <h2 className="text-xl font-semibold text-amber-900 mb-4">
              {filteredOrders.length > 0
                ? `Orders for ${searchedEmail}`
                : `No orders found for ${searchedEmail}`}
            </h2>

            {filteredOrders.length === 0 ? (
              <Card className="border-amber-200">
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-amber-300 mb-4" />
                  <h3 className="text-lg font-medium text-amber-900 mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-amber-600 mb-4">
                    We couldn't find any orders associated with this email address.
                  </p>
                  <Button
                    onClick={() => setLocation("/")}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <Card key={order.id} className="border-amber-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-amber-900">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </h3>
                              <Badge className={statusConfig[order.status].color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[order.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-amber-600 mb-2">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-amber-700">
                              <span>{order.items.length} item(s)</span>
                              <span className="font-semibold">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleTrackOrder(order.id)}
                              className="border-amber-300 text-amber-700 hover:bg-amber-50"
                            >
                              Track Order
                            </Button>
                          </div>
                        </div>

                        <Separator className="my-4 bg-amber-100" />

                        {/* Order Items Preview */}
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-amber-900 truncate max-w-[150px]">
                                  {item.name}
                                </p>
                                <p className="text-xs text-amber-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center bg-amber-100 rounded-lg px-3 py-2">
                              <span className="text-sm text-amber-700">
                                +{order.items.length - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchedEmail && (
          <Card className="border-amber-200">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-amber-300 mb-4" />
              <h3 className="text-lg font-medium text-amber-900 mb-2">
                Enter Your Email to View Orders
              </h3>
              <p className="text-amber-600">
                Please enter the email address you used while placing your order.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
