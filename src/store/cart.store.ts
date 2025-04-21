// src/store/cartStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Product = {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  cantidad: number;
  stock: number;
  imagen: string;
};

type CartState = {
  items: Product[];
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  devtools((set) => ({
    items: [],
    showCart: false,
    setShowCart: (show) => set({ showCart: show }, false, "setShowCart"),

    addToCart: (product) =>
      set(
        (state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, cantidad: item.cantidad + product.cantidad }
                  : item
              ),
            };
          }
          return { items: [...state.items, product] };
        },
        false,
        "addToCart"
      ),

    removeFromCart: (id) =>
      set(
        (state) => ({
          items: state.items.filter((item) => item.id !== id),
        }),
        false,
        "removeFromCart"
      ),

    clearCart: () => set({ items: [] }, false, "clearCart"),
  }))
);
