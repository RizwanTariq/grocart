// store/slices/userSlice.ts
import { StateCreator } from "zustand";
import { IUser } from "@/types";

export type UserSlice = {
  user: IUser | null;

  setUser: (user: IUser) => void;
  updateUser: (user: Partial<IUser>) => void;
  clearUser: () => void;
};

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  user: null,

  setUser: (user) =>
    set({
      user,
    }),

  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  clearUser: () =>
    set({
      user: null,
    }),
});
