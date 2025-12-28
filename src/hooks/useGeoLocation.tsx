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
    (callback: (coords: Coordinates) => void, retryCount = 0) => {
      if (!("geolocation" in navigator)) {
        toast.error("Geolocation is not supported by this browser.");
        return;
      }

      setLoading(true);

      const options = {
        enableHighAccuracy: retryCount === 0, // High accuracy only on first try
        timeout: retryCount === 0 ? 10000 : 5000, // Shorter timeout on retry
        maximumAge: retryCount * 60000, // Accept older positions on retry
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          if (err.code === err.TIMEOUT && retryCount < 2) {
            // Retry with different settings
            setTimeout(() => {
              getCurrentLocation(callback, retryCount + 1);
            }, 1000);
            return;
          }

          setLoading(false);

          let errorMessage = "Failed to get location.";

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permissions in your browser settings.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage =
                "Location services unavailable. Please check your GPS/Wi-Fi connection.";
              break;
            case err.TIMEOUT:
              errorMessage =
                "Location request timed out. Please try again in an area with better signal.";
              break;
          }

          toast.error(errorMessage);

          // Optional: Provide fallback coordinates
          if (
            err.code === err.TIMEOUT ||
            err.code === err.POSITION_UNAVAILABLE
          ) {
            // We could call a fallback IP-based location service here
          }
        },
        options
      );
    },
    []
  );

  return {
    getCurrentLocation,
    setPosition,
    position,
    loading,
  };
}

export default useGeoLocation;
