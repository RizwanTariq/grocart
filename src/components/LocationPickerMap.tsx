"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  value?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
};

function LocationMarker({ value, onChange }: Props) {
  const map = useMapEvents({
    click(e) {
      map.setView(e.latlng, map.getZoom(), { animate: true });
      onChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  if (!value) return null;

  return (
    <Marker
      draggable
      eventHandlers={{
        dragend: (e) => {
          const m = e.target;
          const p = m.getLatLng();
          onChange({ lat: p.lat, lng: p.lng });
        },
      }}
      position={[value.lat, value.lng]}
    />
  );
}

export default function LocationPickerMap({ value, onChange }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fix default marker icons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <MapContainer
      center={[value?.lat ?? 24.8607, value?.lng ?? 67.0011]} // default city
      zoom={14}
      className="h-[350px] w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
