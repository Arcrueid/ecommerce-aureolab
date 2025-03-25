import { type Product } from "@repo/database/types";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  showCart: boolean;
};

type CartActions = {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  clearCart: () => void;
  setShowCart: (show: boolean) => void;
};

export const useCartStore = create(
  persist<CartStore & CartActions>(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      showCart: false,
      setShowCart: (show: boolean) => set({ showCart: show }),
      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id,
        );

        let newItems;

        if (existingItem) {
          newItems = items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          newItems = [...items, { product, quantity }];
        }

        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalPrice });

        toast.success(product.name, {
          description: "Se agregó al carrito correctamente",
        });
      },

      removeItem: (product: Product) => {
        const { items, addItem } = get();
        const newItems = items.filter((item) => item.product.id !== product.id);

        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalPrice });

        toast.success(product.name, {
          description: "Se eliminó del carrito correctamente",
          duration: 10000,
          action: {
            label: "Deshacer",
            onClick: () => {
              addItem(product);
            },
          },
        });
      },

      updateQuantity: (product: Product, quantity: number) => {
        const { items, removeItem } = get();

        if (quantity <= 0) {
          return removeItem(product);
        }

        const newItems = items.map((item) =>
          item.product.id === product.id ? { ...item, quantity } : item,
        );

        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalPrice });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: "aureolab-cart",
      version: 1,
      // @ts-expect-error zustand types
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
