"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

// Google Maps API Key
const Maps_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Define map container styles
const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapDemoCenter: React.FC<{
  data: any;
  isLoading: boolean;
  error: any;
}> = ({ data, isLoading, error }) => {
  const demoCenters = data?.data || [];
  const searchLocationFromBackend = data?.meta?.searchLocation;
  const range = data?.meta?.range;

  const defaultCenter = useMemo(() => ({ lat: 39.8283, lng: -98.5795 }), []); // Center of USA
  const mapCenter = searchLocationFromBackend
    ? searchLocationFromBackend
    : defaultCenter;

  let zoom = 4; // Default USA zoom
  if (searchLocationFromBackend && range) {
    if (range <= 5) zoom = 12;
    else if (range <= 10) zoom = 11;
    else if (range <= 25) zoom = 10;
    else if (range <= 50) zoom = 9;
    else if (range <= 100) zoom = 8;
    else zoom = 7;
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: Maps_API_KEY!,
    id: "google-map-script",
  });

  const loadingState = isLoading || !isLoaded;
  const combinedError = error || loadError;

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted">
      {/* Content overlay */}
      <div className="relative z-10 h-full">
        {loadingState ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="text-sm font-medium text-muted-foreground">
                Loading map...
              </p>
            </div>
          </div>
        ) : combinedError ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm">
              <p className="font-medium text-red-600">Error loading map</p>
              <p className="mt-1 text-sm text-red-500">
                {combinedError instanceof Error
                  ? combinedError.message
                  : "Please check your API key and try again."}
              </p>
            </div>
          </div>
        ) : demoCenters.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg bg-white/80 p-6 text-center backdrop-blur-sm">
              <div className="mb-2 text-4xl">🗺️</div>
              <div className="text-lg font-semibold text-gray-700">
                No locations found
              </div>
              <div className="text-sm text-gray-500">
                Try adjusting your search criteria
              </div>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={{ disableDefaultUI: true }}
          >
            {/* Marker for the user's search location */}
            {searchLocationFromBackend && (
              <Marker
                position={searchLocationFromBackend}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
                title="Your search location"
              />
            )}

            {/* Markers for each demo center */}
            {demoCenters.map((center: any) =>
              center.lat && center.lng ? (
                <Marker
                  key={center.id}
                  position={{ lat: center.lat, lng: center.lng }}
                  title={center.name}
                />
              ) : null,
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default MapDemoCenter;
