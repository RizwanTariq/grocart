"use client";

import { Marker, useMapEvents, Popup } from "react-leaflet";

type Coordinates = { lat: number; lng: number };
type Props = {
  value?: { lat: number; lng: number };
  onPositionChange: ({ lat, lng }: Coordinates) => Promise<void>;
};

function LocationMarker({ value, onPositionChange }: Props) {
  const map = useMapEvents({
    click(e) {
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.8 });
      onPositionChange({
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
          onPositionChange({ lat: p.lat, lng: p.lng });
        },
      }}
      position={[value.lat, value.lng]}
    >
      <Popup>Your address 📍</Popup>
    </Marker>
  );
}

export default LocationMarker;
