// store/slices/cartSlice.ts
import { IProduct } from "@/types";
import { StateCreator } from "zustand";

export type CartItem = {
  productId: IProduct["_id"];
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
  countInStock: number;
};

export type CartSlice = {
  cartItems: CartItem[];

  addToCart: (product: IProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (
  set
) => ({
  cartItems: [],

  addToCart: (product, qty = 1) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.productId === product._id);

      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.productId === product._id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + qty, i.countInStock),
                }
              : i
          ),
        };
      }

      return {
        cartItems: [
          ...state.cartItems,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            unit: product.unit,
            quantity: qty,
            countInStock: product.countInStock,
          },
        ],
      };
    }),

  updateQuantity: (productId, qty) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.min(qty, i.countInStock),
            }
          : i
      ),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.min(i.quantity + 1, i.countInStock),
            }
          : i
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.max(i.quantity - 1, 1),
            }
          : i
      ),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.productId !== productId),
    })),

  clearCart: () => set({ cartItems: [] }),
});
