import { create } from "zustand";
import { Cart } from "types/cart";
import { calcFinalPrice } from "utils/product";

type CartStore = {
  cart: Cart;
  orderNote: string;
  totalQuantity: number;
  totalPrice: number;
  setCart: (updater: (prev: Cart) => Cart) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  orderNote: "",
  totalQuantity: 0,
  totalPrice: 0,
  setCart: (updater) =>
    set(() => {
      const cart = updater(get().cart);
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = cart.reduce(
        (total, item) =>
          total + item.quantity * calcFinalPrice(item.product, item.options),
        0
      );
      return { cart, totalQuantity, totalPrice };
    }),
  setOrderNote: (orderNote) => set({ orderNote }),
  clearCart: () => set({ cart: [], totalQuantity: 0, totalPrice: 0 }),
}));

