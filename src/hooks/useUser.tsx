"use client";

import { useStore } from "@/store/useStore";

export function useUser() {
  const user = useStore((s) => s.user);
  return user;
}
