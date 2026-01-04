"use client";

import { useEffect, useRef } from "react";
import { disconnectSocket, getSocket } from "@/libs/socket";

import { EmitterEvent } from "@/types/generic";
import { useUser } from "@/hooks/useUser";

function GeoLocationUpdater() {
  const { user, isDeliveryBoy } = useUser();

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    // ensure stable socket
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }

    const socket = socketRef.current;

    socket.emit("identity", user._id);

    if (!navigator.geolocation || !isDeliveryBoy) {
      console.warn("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("update-location", {
          userId: user._id,
          isDeliveryBoy,
          event: `${EmitterEvent.D_B_LOCATION_UPDATED}_${user._id}`,
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
      disconnectSocket(); // Disconnect the socket when the component unmounts
    };
  }, [user, isDeliveryBoy]);

  return null;
}

export default GeoLocationUpdater;
