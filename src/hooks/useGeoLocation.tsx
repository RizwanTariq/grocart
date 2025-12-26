"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import useLocalStorageState from "use-local-storage-state";

export type Coordinates = {
  lat: number;
  lng: number;
};

function useGeoLocation() {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useLocalStorageState<Coordinates | null>(
    "checkout-position",
    { defaultValue: null }
  );

  const getCurrentLocation = useCallback(
    (callback: (coords: Coordinates) => void) => {
      if (!("geolocation" in navigator)) {
        toast.error("Geolocation is not supported by this browser.");
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          if (!loading) return;
          console.error(err);
          toast.error(
            err.code === 1
              ? "Please allow location access to proceed."
              : err.code === 3
              ? "Location access timed out. Please try again."
              : err.message
          );
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 200000, // 120 seconds max
        }
      );
    },
    [loading]
  );

  return {
    getCurrentLocation,
    setPosition,
    position,
    loading,
  };
}

export default useGeoLocation;
