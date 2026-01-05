"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
  useRef,
} from "react";
import { getSocket, disconnectSocket } from "@/libs/socket";
import { getSession, useSession } from "next-auth/react";

import type { Socket } from "socket.io-client";

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const identitySentRef = useRef<string | null>(null);

  const hydratedRef = useRef(false);

  // 🔴 Force Hydration on first mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    getSession();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;

    // Wait until auth state is known
    if (status === "loading") return;

    // User logged out → disconnect socket
    if (!userId) {
      disconnectSocket();
      identitySentRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = getSocket();
    setSocket(s);

    const sendIdentity = () => {
      // Prevent duplicate identity emits
      if (identitySentRef.current === userId) return;
      s.emit("identity", userId);
      identitySentRef.current = userId;
      setConnected(true);
    };

    if (!s.connected) {
      s.connect();
    }

    s.on("connect", sendIdentity);
    sendIdentity();

    return () => {
      s.off("connect", sendIdentity);
    };
  }, [status, session]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

// Hook for consuming socket safely
export const useSocket = () => {
  return useContext(SocketContext);
};
