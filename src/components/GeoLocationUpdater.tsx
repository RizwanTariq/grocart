"use client";

import { useEffect, useRef } from "react";

import { EmitterEvent } from "@/types/generic";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/types/enums";
import { useSocket } from "@/SocketContext";

function GeoLocationUpdater() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isDeliveryBoy = session?.user?.role === USER_ROLE.DELIVERY_BOY;
  const { socket, connected } = useSocket();

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!socket || !connected) {
      console.warn("Socket not connected");
      return;
    }
    if (!userId || !isDeliveryBoy) {
      console.warn("User not authenticated or not a delivery boy");
      return;
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("update-location", {
          userId: userId,
          isDeliveryBoy,
          event: `${EmitterEvent.D_B_LOCATION_UPDATED}_${userId}`,
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
  }, [socket, userId, isDeliveryBoy, connected]);

  return null;
}

export default GeoLocationUpdater;
