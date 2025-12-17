"use client";

import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

type Coordinates = { lat: number; lng: number };

function AnimateMapTo({ value, zoom }: { value?: Coordinates; zoom?: number }) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      !value ||
      (map.getCenter().lat === value.lat && map.getCenter().lng === value.lng)
    )
      return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const current = map.getCenter();

      // prevent pointless animation
      if (current.lat === value.lat && current.lng === value.lng) {
        return;
      }

      map.flyTo([value.lat, value.lng], zoom ?? map.getZoom(), {
        animate: true,
        duration: 0.9,
      });
    }, 300); // debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, map, zoom]);

  return null;
}

export default AnimateMapTo;
