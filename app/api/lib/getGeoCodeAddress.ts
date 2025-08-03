/**
 * Geo codes a human-readable address to latitude and longitude coordinates.
 * @param address The address string to geocode.
 * @returns An object with lat and lng, or null if geocoding fails.
 */
export async function getGeoCodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  // First, check if the string is already a lat,lng coordinate pair
  const coordinateRegex = /^(-?\d+\.?\d*),(-?\d+\.?\d*)$/;
  const match = address.match(coordinateRegex);

  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    // Validate if the parsed values are valid numbers
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // If not, use the Google Maps Geocoding API to get the coordinates
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error(
        `Geocoding failed for address: "${address}". Status: ${data.status}. Message: ${data.error_message || "No error message."}`,
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Error during geocoding API call for address: "${address}".`,
      error,
    );
    return null;
  }
}
