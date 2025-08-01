export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Google Maps API key not found" },
      { status: 500 },
    );
  }

  return Response.json({ apiKey });
}
