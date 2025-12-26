"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/libs/socket";
import { useStore } from "@/store/useStore";

function GeoLocationUpdater() {
  const userId = useStore((s) => s.user?._id);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    socket.emit("identity", userId);

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("update-location", {
          userId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [userId]);

  return null;
}

export default GeoLocationUpdater;
