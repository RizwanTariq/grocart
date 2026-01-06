"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MapLoadingOverlay from "./_components/MapLoadingOverlay";
import LocationMarker from "./_components/LocationMarker";
import AnimateMapTo from "./_components/AnimateMapTo";
import { LocateFixed } from "lucide-react";
import useGeoLocation, { Coordinates } from "@/hooks/useGeoLocation";

type Props = {
  value?: Coordinates;
  onPositionChange: ({ lat, lng }: Coordinates) => Promise<void>;
};

export default function LocationPickerMap({
  value,
  onPositionChange,
  loading,
  zoom = 14,
}: Props & { loading?: boolean; zoom?: number }) {
  const [ready, setReady] = useState(false);
  const { getCurrentLocation } = useGeoLocation();

  useEffect(() => {
    // Fix default marker icons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/pin-destination.png",
      iconUrl: "/leaflet/pin-destination.png",
      shadowUrl: "",
      iconSize: [51, 51],
      iconAnchor: [25.5, 51],
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="relative">
      {loading && <MapLoadingOverlay />}
      <MapContainer
        center={[value?.lat ?? 24.8607, value?.lng ?? 67.0011]} // default city
        zoom={zoom}
        touchZoom
        doubleClickZoom
        zoomControl
        scrollWheelZoom
        className="h-[250px] sm:h-[350px] w-full rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* NEW: animate when value changes */}
        <AnimateMapTo value={value} zoom={zoom} />

        <LocationMarker value={value} onPositionChange={onPositionChange} />
      </MapContainer>
      <motion.button
        className="absolute bottom-6 right-3 z-99999 p-2 bg-rose-100 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        onClick={() => getCurrentLocation(onPositionChange)}
      >
        <LocateFixed className="h-5 w-5 text-rose-500" />
      </motion.button>
    </div>
  );
}
