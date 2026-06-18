import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './use-cart';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
}

export interface Order {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  trackingSteps: OrderTrackingStep[];
  createdAt: string;
  updatedAt: string;
}

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByEmail: (email: string) => Order[];
}

const defaultTrackingSteps: OrderTrackingStep[] = [
  {
    status: 'pending',
    label: 'Order Placed',
    description: 'Your order has been placed successfully',
    timestamp: null,
    completed: false,
  },
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been confirmed',
    timestamp: null,
    completed: false,
  },
  {
    status: 'processing',
    label: 'Processing',
    description: 'Your order is being processed',
    timestamp: null,
    completed: false,
  },
  {
    status: 'shipped',
    label: 'Shipped',
    description: 'Your order has been shipped',
    timestamp: null,
    completed: false,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Your order is out for delivery',
    timestamp: null,
    completed: false,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered',
    timestamp: null,
    completed: false,
  },
];

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;

            const updatedTrackingSteps = order.trackingSteps.map((step) => {
              if (step.status === status) {
                return { ...step, completed: true, timestamp: new Date().toISOString() };
              }
              // Mark all previous steps as completed
              const stepIndex = defaultTrackingSteps.findIndex((s) => s.status === step.status);
              const statusIndex = defaultTrackingSteps.findIndex((s) => s.status === status);
              if (stepIndex < statusIndex) {
                return { ...step, completed: true, timestamp: step.timestamp || new Date().toISOString() };
              }
              return step;
            });

            return {
              ...order,
              status,
              trackingSteps: updatedTrackingSteps,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
      getOrdersByEmail: (email) => {
        return get().orders.filter((order) => order.customerEmail === email);
      },
    }),
    {
      name: 'kasthuribai-orders',
    }
  )
);

export { defaultTrackingSteps };
