"use client";

import { useStore } from "@/store/useStore";
import { USER_ROLE } from "@/types/enums";

export function useUser() {
  const user = useStore((s) => s.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const isUser = user?.role === USER_ROLE.USER;
  const isDeliveryBoy = user?.role === USER_ROLE.DELIVERY_BOY;
  return { user, isAdmin, isUser, isDeliveryBoy };
}
