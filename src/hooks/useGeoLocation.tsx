"use client";

export type Coordinates = { lat: number; lng: number };

function useGeoLocation() {
  const getCurrentLocation = (
    handlePositionChange: (coords: Coordinates) => void
  ) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handlePositionChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };
  return { getCurrentLocation };
}

export default useGeoLocation;
