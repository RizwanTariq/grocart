import { auth } from "@/auth";
import { NextResponse } from "next/server";

type ReverseGeocodeRequest = {
  lat: number;
  lng: number;
};

export const POST = auth(async function (req: Request) {
  try {
    const { lat, lng }: ReverseGeocodeRequest = await req.json();

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;

    const res = await fetch(url, {
      headers: {
        // REQUIRED by Nominatim usage policy
        "User-Agent": "grocart/1.0 (contact@yourdomain.com)",
      },
    });

    if (!res.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await res.json();

    return NextResponse.json({
      displayName: data.display_name,
      address: data.address,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Unable to fetch address details. ${error}` },
      { status: 500 }
    );
  }
});
