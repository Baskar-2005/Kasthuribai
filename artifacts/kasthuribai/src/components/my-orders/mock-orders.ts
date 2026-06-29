export type ExtendedOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface MockOrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  color: string;
  category: string;
}

export interface MockTimelineStep {
  key: ExtendedOrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
  active: boolean;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  status: ExtendedOrderStatus;
  items: MockOrderItem[];
  totalAmount: number;
  discount: number;
  shippingCharge: number;
  paymentMethod: string;
  paymentId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  courier?: string;
  trackingId?: string;
  currentLocation?: string;
  currentHub?: string;
  estimatedDelivery?: string;
  deliveryAgent?: string;
  deliveryAgentPhone?: string;
  gstNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: MockTimelineStep[];
  refundAmount?: number;
  refundMethod?: string;
  refundStatus?: "processing" | "approved" | "completed" | "rejected";
  refundDate?: string;
}

function makeTimeline(currentStatus: ExtendedOrderStatus): MockTimelineStep[] {
  const steps: Array<{ key: ExtendedOrderStatus; label: string; description: string }> = [
    { key: "pending",          label: "Order Placed",       description: "Your order has been received" },
    { key: "confirmed",        label: "Payment Confirmed",  description: "Payment verified successfully" },
    { key: "processing",       label: "Packed",             description: "Items packed and ready to ship" },
    { key: "shipped",          label: "Shipped",            description: "Handed over to courier" },
    { key: "out_for_delivery", label: "Out for Delivery",   description: "Delivery agent is on the way" },
    { key: "delivered",        label: "Delivered",          description: "Delivered to your doorstep" },
  ];

  const statusOrder: ExtendedOrderStatus[] = [
    "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered",
  ];

  const currentIdx = statusOrder.indexOf(currentStatus as any);

  const base = new Date("2025-06-20T10:00:00");

  return steps.map((s, i) => {
    const completed = currentIdx >= i;
    const active = currentIdx === i;
    const ts = completed ? new Date(base.getTime() + i * 18 * 3600 * 1000).toISOString() : null;
    return { ...s, timestamp: ts, completed, active };
  });
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ORD-2025-001",
    orderNumber: "KB25001",
    status: "delivered",
    items: [
      {
        id: "i1",
        name: "Kanchipuram Silk Saree – Royal Blue",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
        price: 4800,
        originalPrice: 6500,
        quantity: 1,
        size: "Free Size",
        color: "Royal Blue",
        category: "Women",
      },
      {
        id: "i2",
        name: "Zari Blouse Piece",
        image: "https://images.unsplash.com/photo-1591234836710-b7bd5f2f39e3?w=400&q=80",
        price: 650,
        quantity: 1,
        size: "M",
        color: "Gold",
        category: "Women",
      },
    ],
    totalAmount: 5650,
    discount: 1700,
    shippingCharge: 0,
    paymentMethod: "Razorpay — UPI",
    paymentId: "pay_QJKL1234567890",
    customerName: "Priya Selvam",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: { line1: "12, Gandhi Nagar", line2: "Near Bus Stand", city: "Chidambaram", state: "Tamil Nadu", pincode: "608001" },
    billingAddress: { line1: "12, Gandhi Nagar", city: "Chidambaram", state: "Tamil Nadu", pincode: "608001" },
    courier: "Delhivery",
    trackingId: "DL1234567890IN",
    currentLocation: "Delivered",
    currentHub: "Chidambaram Hub",
    estimatedDelivery: "2025-06-24",
    deliveryAgent: "Ramesh Kumar",
    deliveryAgentPhone: "+91 90000 11111",
    gstNumber: "33AABCK5998P1ZX",
    createdAt: "2025-06-20T10:32:00Z",
    updatedAt: "2025-06-24T14:10:00Z",
    timeline: makeTimeline("delivered"),
  },
  {
    id: "ORD-2025-002",
    orderNumber: "KB25002",
    status: "out_for_delivery",
    items: [
      {
        id: "i3",
        name: "Cotton Formal Shirt – Sky Blue",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
        price: 1299,
        originalPrice: 1800,
        quantity: 2,
        size: "L",
        color: "Sky Blue",
        category: "Men",
      },
    ],
    totalAmount: 2598,
    discount: 502,
    shippingCharge: 40,
    paymentMethod: "Credit Card — HDFC",
    paymentId: "pay_MNOP9876543210",
    customerName: "Arjun Krishnan",
    customerEmail: "arjun@example.com",
    customerPhone: "+91 87654 32109",
    shippingAddress: { line1: "45, Lake View Street", city: "Chennai", state: "Tamil Nadu", pincode: "600028" },
    billingAddress: { line1: "45, Lake View Street", city: "Chennai", state: "Tamil Nadu", pincode: "600028" },
    courier: "BlueDart",
    trackingId: "BD9876543210IN",
    currentLocation: "Mylapore, Chennai",
    currentHub: "Chennai South Hub",
    estimatedDelivery: "2025-06-29",
    deliveryAgent: "Suresh Babu",
    deliveryAgentPhone: "+91 80000 22222",
    createdAt: "2025-06-25T08:00:00Z",
    updatedAt: "2025-06-29T09:15:00Z",
    timeline: makeTimeline("out_for_delivery"),
  },
  {
    id: "ORD-2025-003",
    orderNumber: "KB25003",
    status: "shipped",
    items: [
      {
        id: "i4",
        name: "Kids Ethnic Kurta Pajama – Festive Red",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
        price: 899,
        originalPrice: 1199,
        quantity: 1,
        size: "5-6 yrs",
        color: "Red",
        category: "Kids",
      },
      {
        id: "i5",
        name: "Kids Ethnic Dupatta",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
        price: 299,
        quantity: 1,
        size: "Free Size",
        color: "Gold",
        category: "Kids",
      },
    ],
    totalAmount: 1198,
    discount: 300,
    shippingCharge: 0,
    paymentMethod: "Net Banking — SBI",
    paymentId: "pay_QRST1122334455",
    customerName: "Meena Rajan",
    customerEmail: "meena@example.com",
    customerPhone: "+91 76543 21098",
    shippingAddress: { line1: "7, West Mada Street", city: "Kumbakonam", state: "Tamil Nadu", pincode: "612001" },
    billingAddress: { line1: "7, West Mada Street", city: "Kumbakonam", state: "Tamil Nadu", pincode: "612001" },
    courier: "DTDC",
    trackingId: "DT3344556677IN",
    currentLocation: "Thanjavur Distribution Centre",
    currentHub: "Thanjavur Hub",
    estimatedDelivery: "2025-07-01",
    createdAt: "2025-06-27T12:00:00Z",
    updatedAt: "2025-06-28T17:00:00Z",
    timeline: makeTimeline("shipped"),
  },
  {
    id: "ORD-2025-004",
    orderNumber: "KB25004",
    status: "delivered",
    items: [
      {
        id: "i6",
        name: "Banarasi Lehenga – Bridal Collection",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
        price: 14500,
        originalPrice: 18000,
        quantity: 1,
        size: "M",
        color: "Maroon & Gold",
        category: "Women",
      },
    ],
    totalAmount: 14500,
    discount: 3500,
    shippingCharge: 0,
    paymentMethod: "Razorpay — UPI",
    paymentId: "pay_UVWX5566778899",
    customerName: "Lakshmi Venkat",
    customerEmail: "lakshmi@example.com",
    customerPhone: "+91 99887 76655",
    shippingAddress: { line1: "22, Kaveri Nagar", city: "Trichy", state: "Tamil Nadu", pincode: "620001" },
    billingAddress: { line1: "22, Kaveri Nagar", city: "Trichy", state: "Tamil Nadu", pincode: "620001" },
    courier: "Bluedart Express",
    trackingId: "BE6677889900IN",
    currentLocation: "Delivered",
    estimatedDelivery: "2025-06-22",
    gstNumber: "33AABCK5998P1ZX",
    createdAt: "2025-06-18T09:00:00Z",
    updatedAt: "2025-06-22T15:30:00Z",
    timeline: makeTimeline("delivered"),
  },
  {
    id: "ORD-2025-005",
    orderNumber: "KB25005",
    status: "processing",
    items: [
      {
        id: "i7",
        name: "Traditional Dhoti – White Premium",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
        price: 599,
        originalPrice: 799,
        quantity: 3,
        size: "Free Size",
        color: "White",
        category: "Traditional",
      },
    ],
    totalAmount: 1797,
    discount: 200,
    shippingCharge: 50,
    paymentMethod: "PhonePe UPI",
    paymentId: "pay_YZAB0011223344",
    customerName: "Rajan Murugan",
    customerEmail: "rajan@example.com",
    customerPhone: "+91 88776 65544",
    shippingAddress: { line1: "5, Pillayar Kovil Street", city: "Mayiladuthurai", state: "Tamil Nadu", pincode: "609001" },
    billingAddress: { line1: "5, Pillayar Kovil Street", city: "Mayiladuthurai", state: "Tamil Nadu", pincode: "609001" },
    estimatedDelivery: "2025-07-03",
    notes: "Please pack neatly as it is a gift",
    createdAt: "2025-06-28T16:00:00Z",
    updatedAt: "2025-06-29T08:00:00Z",
    timeline: makeTimeline("processing"),
  },
  {
    id: "ORD-2025-006",
    orderNumber: "KB25006",
    status: "cancelled",
    items: [
      {
        id: "i8",
        name: "Printed Churidar Set – Floral Green",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b5054?w=400&q=80",
        price: 1099,
        originalPrice: 1499,
        quantity: 1,
        size: "S",
        color: "Green",
        category: "Women",
      },
    ],
    totalAmount: 1099,
    discount: 400,
    shippingCharge: 0,
    paymentMethod: "Debit Card — Axis",
    paymentId: "pay_CDEK1234000000",
    customerName: "Kavitha Subramani",
    customerEmail: "kavitha@example.com",
    customerPhone: "+91 77665 54433",
    shippingAddress: { line1: "8, MGR Street", city: "Puducherry", state: "Puducherry", pincode: "605001" },
    billingAddress: { line1: "8, MGR Street", city: "Puducherry", state: "Puducherry", pincode: "605001" },
    createdAt: "2025-06-23T11:00:00Z",
    updatedAt: "2025-06-23T13:00:00Z",
    timeline: [
      { key: "pending", label: "Order Placed", description: "Order received", timestamp: "2025-06-23T11:00:00Z", completed: true, active: false },
      { key: "confirmed", label: "Payment Confirmed", description: "Payment verified", timestamp: "2025-06-23T11:05:00Z", completed: true, active: false },
      { key: "cancelled", label: "Cancelled", description: "Order cancelled by customer", timestamp: "2025-06-23T13:00:00Z", completed: true, active: true },
    ],
    refundAmount: 1099,
    refundMethod: "Debit Card (3–5 days)",
    refundStatus: "completed",
    refundDate: "2025-06-26",
  },
  {
    id: "ORD-2025-007",
    orderNumber: "KB25007",
    status: "returned",
    items: [
      {
        id: "i9",
        name: "Men's Silk Kurta – Navy Blue",
        image: "https://images.unsplash.com/photo-1612903986742-7f5f0e9a1e0c?w=400&q=80",
        price: 1599,
        originalPrice: 2100,
        quantity: 1,
        size: "XL",
        color: "Navy Blue",
        category: "Men",
      },
    ],
    totalAmount: 1599,
    discount: 501,
    shippingCharge: 0,
    paymentMethod: "Google Pay UPI",
    paymentId: "pay_FGHI9900112233",
    customerName: "Senthil Kumar",
    customerEmail: "senthil@example.com",
    customerPhone: "+91 66554 43322",
    shippingAddress: { line1: "14, Rajaji Road", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001" },
    billingAddress: { line1: "14, Rajaji Road", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001" },
    courier: "Ecom Express",
    trackingId: "EC1122334455IN",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-06-28T10:00:00Z",
    timeline: [
      { key: "pending", label: "Order Placed", description: "Order received", timestamp: "2025-06-15T10:00:00Z", completed: true, active: false },
      { key: "confirmed", label: "Payment Confirmed", description: "Payment verified", timestamp: "2025-06-15T10:10:00Z", completed: true, active: false },
      { key: "processing", label: "Packed", description: "Items packed", timestamp: "2025-06-16T09:00:00Z", completed: true, active: false },
      { key: "shipped", label: "Shipped", description: "Handed to courier", timestamp: "2025-06-17T11:00:00Z", completed: true, active: false },
      { key: "delivered", label: "Delivered", description: "Delivered successfully", timestamp: "2025-06-20T14:00:00Z", completed: true, active: false },
      { key: "returned", label: "Return Requested", description: "Wrong size received", timestamp: "2025-06-22T10:00:00Z", completed: true, active: true },
    ],
    refundAmount: 1599,
    refundMethod: "UPI (2–3 days)",
    refundStatus: "processing",
  },
  {
    id: "ORD-2025-008",
    orderNumber: "KB25008",
    status: "delivered",
    items: [
      {
        id: "i10",
        name: "Festive Pavadai Skirt Set – Pink",
        image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&q=80",
        price: 799,
        originalPrice: 999,
        quantity: 2,
        size: "4-6 yrs",
        color: "Pink",
        category: "Kids",
      },
      {
        id: "i11",
        name: "Fancy Hair Accessories Set",
        image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80",
        price: 249,
        quantity: 1,
        size: "Free",
        color: "Multicolor",
        category: "Kids",
      },
    ],
    totalAmount: 1847,
    discount: 400,
    shippingCharge: 0,
    paymentMethod: "Razorpay — Card",
    paymentId: "pay_JKLM5544332211",
    customerName: "Deepa Sundar",
    customerEmail: "deepa@example.com",
    customerPhone: "+91 55443 32211",
    shippingAddress: { line1: "33, Nehru Street", city: "Salem", state: "Tamil Nadu", pincode: "636001" },
    billingAddress: { line1: "33, Nehru Street", city: "Salem", state: "Tamil Nadu", pincode: "636001" },
    courier: "Delhivery",
    trackingId: "DL5544332211IN",
    currentLocation: "Delivered",
    estimatedDelivery: "2025-06-26",
    gstNumber: "33AABCK5998P1ZX",
    createdAt: "2025-06-21T14:00:00Z",
    updatedAt: "2025-06-26T11:00:00Z",
    timeline: makeTimeline("delivered"),
  },
];
