"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { IUser } from "@/types";
import axios from "axios";

function AuthStoreBootstrap() {
  const { data: session, status } = useSession();
  const setUser = useStore((s) => s.setUser);
  const clearUser = useStore((s) => s.clearUser);
  const clearCart = useStore((s) => s.clearCart);

  useEffect(() => {
    if (status === "loading") return;
    const loadUserFromDB = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        clearUser();
        return;
      }

      const res = await axios.get("/api/me");

      if (!res.status || (res.status >= 400 && res.status < 500)) {
        clearUser();
        clearCart();
        return;
      }
      const user = res.data as IUser;

      setUser(user);
    };

    loadUserFromDB();
  }, [session, status, setUser, clearUser, clearCart]);

  return null;
}

export default AuthStoreBootstrap;
