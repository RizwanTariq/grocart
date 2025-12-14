// store/useStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CartSlice, createCartSlice } from "./slices/cartSlice";
import { FavoriteSlice, createFavoriteSlice } from "./slices/favoriteSlice";
import { UserSlice, createUserSlice } from "./slices/userSlice";

type StoreState = CartSlice & FavoriteSlice & UserSlice;

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createCartSlice(...args),
      ...createFavoriteSlice(...args),
      ...createUserSlice(...args),
    }),
    {
      name: "grocart-shop-storage",

      storage: createJSONStorage(() => localStorage),

      // 🔐 Optional but recommended
      partialize: (state) => ({
        user: state.user,
        cartItems: state.cartItems,
        favorites: state.favorites,
      }),
    }
  )
);
