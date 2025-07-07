import { CartTableSelect } from "@/repo/schema/schema";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CartState = {
  cart: Array<CartTableSelect> | undefined;
  setCart: (cart: Array<CartTableSelect> | undefined) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      immer((set) => ({
        cart: undefined,
        setCart: (cart) => set(() => ({ cart })),
        increment: (id) =>
          set((state) => {
            console.log(id);
            console.log(state.cart[id]);
            if (state?.cart && state.cart[id]) {
              state.cart[id].quantity++;
            }
          }),
        decrement: (id) =>
          set((state) => {
            if (state?.cart && state.cart[id]) {
              state.cart[id].quantity--;
            }
          }),
      })),
      {
        name: "bear-storage",
      },
    ),
  ),
);
