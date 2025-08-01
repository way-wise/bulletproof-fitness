import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey: googleMapsApiKey });
  } catch (error) {
    console.error("Error fetching Google Maps API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
