"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type Coordinates = {
  lat: number;
  lng: number;
};

function distance(a: Coordinates, b: Coordinates) {
  return Math.hypot(a.lat - b.lat, a.lng - b.lng);
}

function closestPointOnSegment(p: Coordinates, a: Coordinates, b: Coordinates) {
  const apx = p.lat - a.lat;
  const apy = p.lng - a.lng;
  const abx = b.lat - a.lat;
  const aby = b.lng - a.lng;

  const ab2 = abx * abx + aby * aby;
  const t =
    ab2 === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));

  return {
    lat: a.lat + abx * t,
    lng: a.lng + aby * t,
  };
}

function snapToRoute(
  point: Coordinates,
  route: [number, number][]
): Coordinates {
  let closest = point;
  let min = Infinity;

  for (let i = 0; i < route.length - 1; i++) {
    const a = { lat: route[i][0], lng: route[i][1] };
    const b = { lat: route[i + 1][0], lng: route[i + 1][1] };
    const snap = closestPointOnSegment(point, a, b);
    const d = distance(point, snap);

    if (d < min) {
      min = d;
      closest = snap;
    }
  }

  return closest;
}

function toRad(v: number) {
  return (v * Math.PI) / 180;
}

function bearing(from: Coordinates, to: Coordinates) {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function interpolate(
  from: Coordinates,
  to: Coordinates,
  t: number
): Coordinates {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

function CameraFollow({ position }: { position: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng], map.getZoom(), {
      animate: true,
      duration: 0.5,
    });
  }, [position.lat, position.lng, map]);

  return null;
}

type Props = {
  staticPosition: Coordinates;
  movingPosition: Coordinates;
  zoom?: number;
  follow?: boolean;
  status?: "online" | "offline" | "arrived";
  onProgressAction?: (distanceKm: number, etaMinutes: number) => void;
};

export default function LiveTrackingMap({
  staticPosition,
  movingPosition,
  zoom = 14,
  follow = true,
  status = "online",
  onProgressAction,
}: Props) {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [animatedPos, setAnimatedPos] = useState<Coordinates>(movingPosition);
  const prevPosRef = useRef<Coordinates>(movingPosition);
  const smoothAngle = useRef(0);

  useEffect(() => {
    if (!route.length) return;

    const snappedTarget = snapToRoute(movingPosition, route);
    const from = prevPosRef.current;
    const to = snappedTarget;

    const steps = 24;
    let frame = 0;

    const id = setInterval(() => {
      frame++;
      setAnimatedPos(interpolate(from, to, frame / steps));
      smoothAngle.current =
        smoothAngle.current + (bearing(from, to) - smoothAngle.current) * 0.25;
      if (frame >= steps) {
        clearInterval(id);
        prevPosRef.current = to;
      }
    }, 40);

    return () => clearInterval(id);
  }, [movingPosition, route]);

  const pickupIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/leaflet/pin-destination.png",
        iconSize: [42, 42],
        iconAnchor: [18, 42],
      }),
    []
  );

  const riderIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
            <div class="relative transition-all duration-300 ${
              status === "arrived"
                ? "animate-bounce"
                : status === "offline"
                ? "opacity-50"
                : ""
            }">
              <div class="absolute inset-0 rounded-full ${
                status === "offline" ? "bg-red-500/40" : "bg-rose-500/40"
              } animate-ping"></div>
              <div class="flex items-center justify-center w-9 h-9 rounded-full bg-sky-300 border-2 border-white">
              <img src="/leaflet/delivery-boy.png" alt="Bike" class="w-[90%] h-[90%] object-contain" />
              </div>
            </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [18, 18],
      }),
    [status]
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${staticPosition.lng},${staticPosition.lat};${movingPosition.lng},${movingPosition.lat}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!data.routes?.length) return;
        const route = data.routes[0];
        setRoute(
          route.geometry.coordinates.map(([lng, lat]: [number, number]) => [
            lat,
            lng,
          ])
        );

        if (onProgressAction) {
          const distance = route.distance / 1000;
          const duration = route.duration / 60;
          onProgressAction(distance, duration);
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.error(e);
      }
    };
    fetchRoute();
    return () => controller.abort();
  }, [staticPosition, movingPosition, onProgressAction]);

  return (
    <MapContainer
      center={[movingPosition.lat, movingPosition.lng]}
      zoom={zoom}
      scrollWheelZoom
      className="h-[300px] sm:h-[450px] w-full rounded-2xl shadow-xl overflow-hidden"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {follow && <CameraFollow position={animatedPos} />}

      <Marker
        position={[staticPosition.lat, staticPosition.lng]}
        icon={pickupIcon}
      />
      <Marker position={[animatedPos.lat, animatedPos.lng]} icon={riderIcon} />

      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{ color: "#F5276C", weight: 9, opacity: 0.7 }}
        />
      )}
    </MapContainer>
  );
}
