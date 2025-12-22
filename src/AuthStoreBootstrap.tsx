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

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !session?.user?.email) {
      clearUser();
      return;
    }
    const loadUserFromDB = async () => {
      const res = await axios.get("/api/me");

      if (!res.status || (res.status >= 400 && res.status < 500)) {
        clearUser();
        return;
      }
      const user = res.data as IUser;

      setUser(user);
    };

    loadUserFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return null;
}

export default AuthStoreBootstrap;
