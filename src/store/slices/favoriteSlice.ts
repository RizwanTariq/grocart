// store/slices/favoriteSlice.ts
import { StateCreator } from "zustand";

export type FavoriteSlice = {
  favorites: string[]; // product ids
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

export const createFavoriteSlice: StateCreator<
  FavoriteSlice,
  [],
  [],
  FavoriteSlice
> = (set, get) => ({
  favorites: [],

  addFavorite: (id) =>
    set((state) => ({
      favorites: [...state.favorites, id],
    })),

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((f) => f !== id),
    })),

  toggleFavorite: (id) => {
    const favorites = get().favorites;
    if (favorites.includes(id)) {
      get().removeFavorite(id);
    } else {
      get().addFavorite(id);
    }
  },
});
