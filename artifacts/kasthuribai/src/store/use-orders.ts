import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipped'
  | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  category: string;
  rating: number;
  reviewCount: number;
  size?: string;
  color?: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  shippingCharge: number;
  status: OrderStatus;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  courier?: string;
  trackingId?: string;
  currentLocation?: string;
  currentHub?: string;
  estimatedDelivery?: string;
  deliveryAgent?: string;
  deliveryAgentPhone?: string;
  gstNumber?: string;
  notes?: string;
  refundAmount?: number;
  refundMethod?: string;
  refundStatus?: 'processing' | 'approved' | 'completed' | 'rejected';
  trackingSteps: OrderTrackingStep[];
  createdAt: string;
  updatedAt: string;
}

// ─── Tracking step helpers ───────────────────────────────────────────────────
const DELIVERY_STEPS: Array<{ status: OrderStatus; label: string; description: string }> = [
  { status: 'pending',          label: 'Order Placed',      description: 'Your order has been received' },
  { status: 'confirmed',        label: 'Payment Confirmed', description: 'Payment verified successfully' },
  { status: 'processing',       label: 'Packed',            description: 'Items packed and ready to ship' },
  { status: 'shipped',          label: 'Shipped',           description: 'Handed over to courier' },
  { status: 'out_for_delivery', label: 'Out for Delivery',  description: 'Delivery agent is on the way' },
  { status: 'delivered',        label: 'Delivered',         description: 'Delivered to your doorstep' },
];

const DELIVERY_STATUS_ORDER: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered',
];

export function buildTrackingSteps(currentStatus: OrderStatus, baseDate: string): OrderTrackingStep[] {
  const currentIdx = DELIVERY_STATUS_ORDER.indexOf(currentStatus as OrderStatus);
  const base = new Date(baseDate).getTime();
  return DELIVERY_STEPS.map((step, i) => {
    const completed = currentIdx >= i;
    const ts = completed ? new Date(base + i * 16 * 3600 * 1000).toISOString() : null;
    return { ...step, completed, timestamp: ts };
  });
}

export function advanceTrackingSteps(
  steps: OrderTrackingStep[],
  newStatus: OrderStatus,
): OrderTrackingStep[] {
  const newIdx = DELIVERY_STATUS_ORDER.indexOf(newStatus);
  return steps.map((step) => {
    const stepIdx = DELIVERY_STATUS_ORDER.indexOf(step.status as OrderStatus);
    if (stepIdx < 0) return step;
    if (stepIdx <= newIdx && !step.completed) {
      return { ...step, completed: true, timestamp: new Date().toISOString() };
    }
    return step;
  });
}

// ─── Seed mock orders ────────────────────────────────────────────────────────
function makeSeedOrders(): Order[] {
  const now = Date.now();
  const ago = (days: number, hours = 0) =>
    new Date(now - (days * 86400 + hours * 3600) * 1000).toISOString();

  return [
    {
      id: 'ORD-2025-001',
      orderNumber: 'KB25001',
      razorpayOrderId: 'order_seed_001',
      razorpayPaymentId: 'pay_QJKL1234567890',
      status: 'delivered',
      paymentMethod: 'Razorpay — UPI',
      customerName: 'Priya Selvam',
      customerEmail: 'priya@example.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: '12, Gandhi Nagar, Near Bus Stand, Chidambaram, Tamil Nadu - 608001',
      gstNumber: '33AABCK5998P1ZX',
      totalAmount: 5650,
      discount: 1700,
      shippingCharge: 0,
      courier: 'Delhivery',
      trackingId: 'DL1234567890IN',
      currentLocation: 'Delivered',
      currentHub: 'Chidambaram Hub',
      estimatedDelivery: new Date(now - 5 * 86400000).toISOString().split('T')[0],
      deliveryAgent: 'Ramesh Kumar',
      deliveryAgentPhone: '+91 90000 11111',
      items: [
        { id: 'i1', name: 'Kanchipuram Silk Saree – Royal Blue', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', price: 4800, originalPrice: 6500, quantity: 1, category: 'Women', rating: 4.8, reviewCount: 220, size: 'Free Size', color: 'Royal Blue' },
        { id: 'i2', name: 'Zari Blouse Piece', image: 'https://images.unsplash.com/photo-1591234836710-b7bd5f2f39e3?w=400&q=80', price: 650, quantity: 1, category: 'Women', rating: 4.5, reviewCount: 88, size: 'M', color: 'Gold' },
      ],
      trackingSteps: buildTrackingSteps('delivered', ago(9)),
      createdAt: ago(9),
      updatedAt: ago(5),
    },
    {
      id: 'ORD-2025-002',
      orderNumber: 'KB25002',
      razorpayOrderId: 'order_seed_002',
      razorpayPaymentId: 'pay_MNOP9876543210',
      status: 'out_for_delivery',
      paymentMethod: 'Credit Card — HDFC',
      customerName: 'Arjun Krishnan',
      customerEmail: 'arjun@example.com',
      customerPhone: '+91 87654 32109',
      shippingAddress: '45, Lake View Street, Mylapore, Chennai, Tamil Nadu - 600028',
      totalAmount: 2638,
      discount: 502,
      shippingCharge: 40,
      courier: 'BlueDart',
      trackingId: 'BD9876543210IN',
      currentLocation: 'Mylapore, Chennai',
      currentHub: 'Chennai South Hub',
      estimatedDelivery: new Date(now + 0.5 * 86400000).toISOString().split('T')[0],
      deliveryAgent: 'Suresh Babu',
      deliveryAgentPhone: '+91 80000 22222',
      items: [
        { id: 'i3', name: 'Cotton Formal Shirt – Sky Blue', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', price: 1299, originalPrice: 1800, quantity: 2, category: 'Men', rating: 4.4, reviewCount: 156, size: 'L', color: 'Sky Blue' },
      ],
      trackingSteps: buildTrackingSteps('out_for_delivery', ago(4)),
      createdAt: ago(4),
      updatedAt: ago(0, 6),
    },
    {
      id: 'ORD-2025-003',
      orderNumber: 'KB25003',
      razorpayOrderId: 'order_seed_003',
      razorpayPaymentId: 'pay_QRST1122334455',
      status: 'shipped',
      paymentMethod: 'Net Banking — SBI',
      customerName: 'Meena Rajan',
      customerEmail: 'meena@example.com',
      customerPhone: '+91 76543 21098',
      shippingAddress: '7, West Mada Street, Kumbakonam, Tamil Nadu - 612001',
      totalAmount: 1198,
      discount: 300,
      shippingCharge: 0,
      courier: 'DTDC',
      trackingId: 'DT3344556677IN',
      currentLocation: 'Thanjavur Distribution Centre',
      currentHub: 'Thanjavur Hub',
      estimatedDelivery: new Date(now + 2 * 86400000).toISOString().split('T')[0],
      items: [
        { id: 'i4', name: 'Kids Ethnic Kurta Pajama – Festive Red', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80', price: 899, originalPrice: 1199, quantity: 1, category: 'Kids', rating: 4.3, reviewCount: 64, size: '5-6 yrs', color: 'Red' },
        { id: 'i5', name: 'Kids Ethnic Dupatta', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', price: 299, quantity: 1, category: 'Kids', rating: 4.1, reviewCount: 32, size: 'Free', color: 'Gold' },
      ],
      trackingSteps: buildTrackingSteps('shipped', ago(2)),
      createdAt: ago(2),
      updatedAt: ago(1),
    },
    {
      id: 'ORD-2025-004',
      orderNumber: 'KB25004',
      razorpayOrderId: 'order_seed_004',
      razorpayPaymentId: 'pay_UVWX5566778899',
      status: 'delivered',
      paymentMethod: 'Razorpay — UPI',
      customerName: 'Lakshmi Venkat',
      customerEmail: 'lakshmi@example.com',
      customerPhone: '+91 99887 76655',
      shippingAddress: '22, Kaveri Nagar, Trichy, Tamil Nadu - 620001',
      gstNumber: '33AABCK5998P1ZX',
      totalAmount: 14500,
      discount: 3500,
      shippingCharge: 0,
      courier: 'Bluedart Express',
      trackingId: 'BE6677889900IN',
      currentLocation: 'Delivered',
      estimatedDelivery: new Date(now - 7 * 86400000).toISOString().split('T')[0],
      items: [
        { id: 'i6', name: 'Banarasi Lehenga – Bridal Collection', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80', price: 14500, originalPrice: 18000, quantity: 1, category: 'Women', rating: 4.9, reviewCount: 312, size: 'M', color: 'Maroon & Gold' },
      ],
      trackingSteps: buildTrackingSteps('delivered', ago(11)),
      createdAt: ago(11),
      updatedAt: ago(7),
    },
    {
      id: 'ORD-2025-005',
      orderNumber: 'KB25005',
      razorpayOrderId: 'order_seed_005',
      razorpayPaymentId: 'pay_YZAB0011223344',
      status: 'processing',
      paymentMethod: 'PhonePe UPI',
      customerName: 'Rajan Murugan',
      customerEmail: 'rajan@example.com',
      customerPhone: '+91 88776 65544',
      shippingAddress: '5, Pillayar Kovil Street, Mayiladuthurai, Tamil Nadu - 609001',
      totalAmount: 1847,
      discount: 200,
      shippingCharge: 50,
      notes: 'Please pack neatly as it is a gift',
      estimatedDelivery: new Date(now + 4 * 86400000).toISOString().split('T')[0],
      items: [
        { id: 'i7', name: 'Traditional Dhoti – White Premium', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80', price: 599, originalPrice: 799, quantity: 3, category: 'Traditional', rating: 4.2, reviewCount: 48, size: 'Free Size', color: 'White' },
      ],
      trackingSteps: buildTrackingSteps('processing', ago(1)),
      createdAt: ago(1),
      updatedAt: ago(0, 8),
    },
    {
      id: 'ORD-2025-006',
      orderNumber: 'KB25006',
      razorpayOrderId: 'order_seed_006',
      razorpayPaymentId: 'pay_CDEK1234000000',
      status: 'cancelled',
      paymentMethod: 'Debit Card — Axis',
      customerName: 'Kavitha Subramani',
      customerEmail: 'kavitha@example.com',
      customerPhone: '+91 77665 54433',
      shippingAddress: '8, MGR Street, Puducherry - 605001',
      totalAmount: 1099,
      discount: 400,
      shippingCharge: 0,
      refundAmount: 1099,
      refundMethod: 'Debit Card (3–5 days)',
      refundStatus: 'completed',
      items: [
        { id: 'i8', name: 'Printed Churidar Set – Floral Green', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5054?w=400&q=80', price: 1099, originalPrice: 1499, quantity: 1, category: 'Women', rating: 4.1, reviewCount: 52, size: 'S', color: 'Green' },
      ],
      trackingSteps: [
        { status: 'pending', label: 'Order Placed', description: 'Order received', timestamp: ago(6), completed: true },
        { status: 'confirmed', label: 'Payment Confirmed', description: 'Payment verified', timestamp: ago(6, -0.1), completed: true },
        { status: 'cancelled', label: 'Cancelled', description: 'Order cancelled by customer', timestamp: ago(6, -2), completed: true },
      ],
      createdAt: ago(6),
      updatedAt: ago(6),
    },
    {
      id: 'ORD-2025-007',
      orderNumber: 'KB25007',
      razorpayOrderId: 'order_seed_007',
      razorpayPaymentId: 'pay_FGHI9900112233',
      status: 'returned',
      paymentMethod: 'Google Pay UPI',
      customerName: 'Senthil Kumar',
      customerEmail: 'senthil@example.com',
      customerPhone: '+91 66554 43322',
      shippingAddress: '14, Rajaji Road, Coimbatore, Tamil Nadu - 641001',
      totalAmount: 1599,
      discount: 501,
      shippingCharge: 0,
      courier: 'Ecom Express',
      trackingId: 'EC1122334455IN',
      refundAmount: 1599,
      refundMethod: 'UPI (2–3 days)',
      refundStatus: 'processing',
      items: [
        { id: 'i9', name: "Men's Silk Kurta – Navy Blue", image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', price: 1599, originalPrice: 2100, quantity: 1, category: 'Men', rating: 4.3, reviewCount: 77, size: 'XL', color: 'Navy Blue' },
      ],
      trackingSteps: [
        { status: 'pending', label: 'Order Placed', description: 'Order received', timestamp: ago(14), completed: true },
        { status: 'confirmed', label: 'Payment Confirmed', description: 'Payment verified', timestamp: ago(14, -0.2), completed: true },
        { status: 'processing', label: 'Packed', description: 'Items packed', timestamp: ago(13), completed: true },
        { status: 'shipped', label: 'Shipped', description: 'Handed to courier', timestamp: ago(12), completed: true },
        { status: 'delivered', label: 'Delivered', description: 'Delivered successfully', timestamp: ago(9), completed: true },
        { status: 'returned', label: 'Return Requested', description: 'Wrong size received', timestamp: ago(7), completed: true },
      ],
      createdAt: ago(14),
      updatedAt: ago(7),
    },
    {
      id: 'ORD-2025-008',
      orderNumber: 'KB25008',
      razorpayOrderId: 'order_seed_008',
      razorpayPaymentId: 'pay_JKLM5544332211',
      status: 'delivered',
      paymentMethod: 'Razorpay — Card',
      customerName: 'Deepa Sundar',
      customerEmail: 'deepa@example.com',
      customerPhone: '+91 55443 32211',
      shippingAddress: '33, Nehru Street, Salem, Tamil Nadu - 636001',
      gstNumber: '33AABCK5998P1ZX',
      totalAmount: 1847,
      discount: 400,
      shippingCharge: 0,
      courier: 'Delhivery',
      trackingId: 'DL5544332211IN',
      currentLocation: 'Delivered',
      items: [
        { id: 'i10', name: 'Festive Pavadai Skirt Set – Pink', image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&q=80', price: 799, originalPrice: 999, quantity: 2, category: 'Kids', rating: 4.6, reviewCount: 104, size: '4-6 yrs', color: 'Pink' },
        { id: 'i11', name: 'Fancy Hair Accessories Set', image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80', price: 249, quantity: 1, category: 'Kids', rating: 4.2, reviewCount: 29, size: 'Free', color: 'Multicolor' },
      ],
      trackingSteps: buildTrackingSteps('delivered', ago(8)),
      createdAt: ago(8),
      updatedAt: ago(3),
    },
    // Demo orders from admin
    {
      id: 'ORD-DEMO-001',
      orderNumber: 'DEMO001',
      razorpayOrderId: 'pay_demo_Qk9xZ3mVc',
      razorpayPaymentId: 'pay_demo_Qk9xZ3mVc',
      status: 'delivered',
      paymentMethod: 'UPI',
      customerName: 'Karthik Rajan',
      customerEmail: 'karthik@example.com',
      customerPhone: '9876543210',
      shippingAddress: '14, Nehru Street, Cuddalore - 607001, Tamil Nadu',
      totalAmount: 3299,
      discount: 0,
      shippingCharge: 0,
      items: [
        { id: 'p1', name: 'Pure Cotton Formal Shirt', image: '', price: 799, quantity: 2, category: 'Men', rating: 4.5, reviewCount: 128 },
        { id: 'p2', name: 'Embroidered Kurti Set', image: '', price: 899, quantity: 1, category: 'Women', rating: 4.3, reviewCount: 74 },
      ],
      trackingSteps: buildTrackingSteps('delivered', ago(3)),
      createdAt: ago(3),
      updatedAt: ago(1),
    },
    {
      id: 'ORD-DEMO-002',
      orderNumber: 'DEMO002',
      razorpayOrderId: 'pay_demo_Lp7wYn2bAj',
      razorpayPaymentId: 'pay_demo_Lp7wYn2bAj',
      status: 'shipped',
      paymentMethod: 'Net Banking',
      customerName: 'Meena Sundaram',
      customerEmail: 'meena.s@gmail.com',
      customerPhone: '9444112233',
      shippingAddress: '7/3, Raja Nagar, Chidambaram - 608001, Tamil Nadu',
      totalAmount: 2499,
      discount: 0,
      shippingCharge: 0,
      courier: 'Delhivery',
      items: [
        { id: 'p3', name: 'Kanjeevaram Silk Saree', image: '', price: 2499, quantity: 1, category: 'Traditional', rating: 4.8, reviewCount: 89 },
      ],
      trackingSteps: buildTrackingSteps('shipped', ago(1)),
      createdAt: ago(1),
      updatedAt: ago(0, 4),
    },
    {
      id: 'ORD-DEMO-003',
      orderNumber: 'DEMO003',
      razorpayOrderId: '',
      razorpayPaymentId: null,
      status: 'confirmed',
      paymentMethod: 'COD',
      customerName: 'Selvam Murugan',
      customerEmail: '',
      customerPhone: '8012345678',
      shippingAddress: '22, Fishermen Colony, Cuddalore Port - 607003, Tamil Nadu',
      totalAmount: 1197,
      discount: 0,
      shippingCharge: 0,
      items: [
        { id: 'p4', name: 'Kids Essential T-shirt Pack', image: '', price: 399, quantity: 3, category: 'Kids', rating: 4.6, reviewCount: 156 },
      ],
      trackingSteps: buildTrackingSteps('confirmed', ago(0, 5)),
      createdAt: ago(0, 5),
      updatedAt: ago(0, 5),
    },
    {
      id: 'ORD-DEMO-004',
      orderNumber: 'DEMO004',
      razorpayOrderId: '',
      razorpayPaymentId: null,
      status: 'pending',
      paymentMethod: 'COD',
      customerName: 'Priya Anand',
      customerEmail: 'priya.a@outlook.com',
      customerPhone: '9500667788',
      shippingAddress: '5, Gandhi Road, Villupuram - 605602, Tamil Nadu',
      totalAmount: 1499,
      discount: 0,
      shippingCharge: 0,
      items: [
        { id: 'p5', name: 'Designer Georgette Saree', image: '', price: 1499, quantity: 1, category: 'Women', rating: 4.2, reviewCount: 52 },
      ],
      trackingSteps: buildTrackingSteps('pending', ago(0, 0.5)),
      createdAt: ago(0, 0.5),
      updatedAt: ago(0, 0.5),
    },
    {
      id: 'ORD-DEMO-005',
      orderNumber: 'DEMO005',
      razorpayOrderId: 'pay_demo_Cq2xJn9pFr',
      razorpayPaymentId: 'pay_demo_Cq2xJn9pFr',
      status: 'processing',
      paymentMethod: 'Credit Card',
      customerName: 'Ravi Kumar',
      customerEmail: 'ravi.k@yahoo.com',
      customerPhone: '7299001122',
      shippingAddress: '88, Anna Salai, Chennai - 600002, Tamil Nadu',
      totalAmount: 5997,
      discount: 0,
      shippingCharge: 0,
      items: [
        { id: 'p6', name: 'Party Wear Evening Gown', image: '', price: 1999, quantity: 3, category: 'Festive', rating: 4.4, reviewCount: 43 },
      ],
      trackingSteps: buildTrackingSteps('processing', ago(0, 2)),
      createdAt: ago(0, 2),
      updatedAt: ago(0, 1),
    },
  ];
}

// ─── Store ───────────────────────────────────────────────────────────────────
interface OrdersStore {
  orders: Order[];
  _seeded: boolean;
  addOrder: (order: Omit<Order, 'orderNumber' | 'discount' | 'shippingCharge' | 'paymentMethod'> & Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderDetails: (orderId: string, details: Partial<Order>) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByEmail: (email: string) => Order[];
  seedIfEmpty: () => void;
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      _seeded: false,

      seedIfEmpty: () => {
        const { _seeded } = get();
        if (_seeded) return;
        const seeds = makeSeedOrders();
        set((state) => ({
          _seeded: true,
          orders: [
            ...seeds.filter(s => !state.orders.find(o => o.id === s.id)),
            ...state.orders,
          ],
        }));
      },

      addOrder: (order) => {
        const full: Order = {
          orderNumber: order.id.slice(-6).toUpperCase(),
          discount: 0,
          shippingCharge: 0,
          paymentMethod: 'Razorpay',
          ...order,
        } as Order;
        set((state) => ({ orders: [full, ...state.orders] }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const updatedSteps = advanceTrackingSteps(order.trackingSteps, status);
            // For special statuses (cancelled, returned, refunded), append if not already there
            const alreadyHasStatus = updatedSteps.some(s => s.status === status);
            const finalSteps = alreadyHasStatus ? updatedSteps : [
              ...updatedSteps,
              { status, label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '), description: `Order marked as ${status}`, timestamp: new Date().toISOString(), completed: true },
            ];
            return { ...order, status, trackingSteps: finalSteps, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      updateOrderDetails: (orderId, details) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, ...details, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
      getOrdersByEmail: (email) => get().orders.filter((o) => o.customerEmail === email),
    }),
    { name: 'kasthuribai-orders-v2' },
  ),
);

export { };
