import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/mock-data';

export interface CartItem extends Product {
  quantity: number;
}

export interface LastAdded extends Product {
  addedAt: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  cartBounce: boolean;
  lastAdded: LastAdded | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      cartBounce: false,
      lastAdded: null,
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...state.items, { ...product, quantity: 1 }];
          return {
            items: newItems,
            cartBounce: true,
            lastAdded: { ...product, addedAt: Date.now() },
          };
        });
        setTimeout(() => set({ cartBounce: false, lastAdded: null }), 2500);
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: quantity === 0
            ? state.items.filter((item) => item.id !== productId)
            : state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
        }));
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'kasthuribai-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
