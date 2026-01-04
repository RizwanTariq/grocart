"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { IUser } from "@/types";
import axios from "axios";

function AuthStoreBootstrap() {
  const setUser = useStore((s) => s.setUser);
  const clearUser = useStore((s) => s.clearUser);

  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const loadUserFromDB = async () => {
      try {
        const res = await axios.get("/api/me");

        if (res.status !== 200) {
          clearUser();
          return;
        }
        const user = res.data as IUser;

        setUser(user);
      } catch (error) {
        console.error(error);
        clearUser();
      }
    };

    loadUserFromDB();
  }, [setUser, clearUser]);

  return null;
}

export default AuthStoreBootstrap;
