"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

// Type for demo center with coordinates
interface DemoCenterWithCoords {
  id: string;
  buildingType: string;
  name: string;
  address: string;
  contact: string;
  cityZip: string;
  bio: string;
  image: string;
  availability?: string;
  weekdays: string[];
  weekends: string[];
  weekdayOpen?: string;
  weekdayClose?: string;
  weekendOpen?: string;
  weekendClose?: string;
  createdAt: string;
  updatedAt: string;
  demoCenterEquipments: Array<{
    id: string;
    equipment: {
      id: string;
      name: string;
    };
  }>;
  lat?: number;
  lng?: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface GoogleMapWithMarkersProps {
  demoCenters: DemoCenterWithCoords[];
  apiKey: string;
  userLocation?: Coordinates | null;
  searchLocation?: Coordinates | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

// USA center coordinates
const defaultCenter = {
  lat: 39.8283, // Geographic center of USA
  lng: -98.5795,
};

const defaultZoom = 4;

const GoogleMapWithMarkers: React.FC<GoogleMapWithMarkersProps> = ({
  demoCenters,
  apiKey,
  userLocation,
  searchLocation,
}) => {
  const [selectedCenter, setSelectedCenter] = useState<DemoCenterWithCoords | null>(null);
  const [centersWithCoords, setCentersWithCoords] = useState<DemoCenterWithCoords[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to geocode addresses using Google Maps API
  const geocodeAddress = useCallback(
    async (address: string, cityZip: string): Promise<{ lat: number; lng: number } | null> => {
      try {
        const fullAddress = `${address}, ${cityZip}`;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        }
        return null;
      } catch (error) {
        console.error("Geocoding error:", error);
        return null;
      }
    },
    [apiKey]
  );

  // Geocode all demo centers when component mounts or demo centers change
  useEffect(() => {
    const geocodeAllCenters = async () => {
      if (!apiKey || demoCenters.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const centersWithCoordinates = await Promise.all(
        demoCenters.map(async (center) => {
          const coords = await geocodeAddress(center.address, center.cityZip);
          return {
            ...center,
            lat: coords?.lat,
            lng: coords?.lng,
          };
        })
      );

      // Filter out centers that couldn't be geocoded
      const validCenters = centersWithCoordinates.filter(
        (center) => center.lat && center.lng
      );

      setCentersWithCoords(validCenters);
      setIsLoading(false);
    };

    geocodeAllCenters();
  }, [demoCenters, apiKey, geocodeAddress]);

  const onMarkerClick = (center: DemoCenterWithCoords) => {
    setSelectedCenter(center);
  };

  const onInfoWindowClose = () => {
    setSelectedCenter(null);
  };

  if (!apiKey) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded border bg-gray-100">
        <div className="text-center text-gray-600">
          <div className="mb-2 text-2xl">🗺️</div>
          <div className="text-lg font-semibold">Google Maps API Key Required</div>
          <div className="text-sm">Please provide your Google Maps API key to view the map</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded border bg-gray-100">
        <div className="text-center text-gray-600">
          <div className="mb-2 text-2xl">📍</div>
          <div className="text-lg font-semibold">Loading Demo Center Locations...</div>
          <div className="text-sm">Geocoding addresses for map markers</div>
        </div>
      </div>
    );
  }

  // Determine map center and zoom based on location state
  const getMapCenter = () => {
    if (userLocation) return userLocation;
    if (searchLocation) return searchLocation;
    return defaultCenter;
  };

  const getMapZoom = () => {
    if (userLocation || searchLocation) return 10;
    return defaultZoom;
  };

  return (
    <div className="w-full rounded border">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={getMapCenter()}
          zoom={getMapZoom()}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {/* Demo Center Markers */}
          {centersWithCoords.map((center) => (
            <Marker
              key={center.id}
              position={{ lat: center.lat!, lng: center.lng! }}
              onClick={() => onMarkerClick(center)}
              title={center.name}
            />
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                url: "data:image/svg+xml;charset=UTF-8,%3csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='10' cy='10' r='8' fill='%234285f4'/%3e%3ccircle cx='10' cy='10' r='3' fill='white'/%3e%3c/svg%3e",
                scaledSize: new window.google.maps.Size(20, 20),
              }}
            />
          )}

          {/* Search Location Marker */}
          {searchLocation && (
            <Marker
              position={searchLocation}
              title="Search Location"
              icon={{
                url: "data:image/svg+xml;charset=UTF-8,%3csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='10' cy='10' r='8' fill='%23ea4335'/%3e%3ccircle cx='10' cy='10' r='3' fill='white'/%3e%3c/svg%3e",
                scaledSize: new window.google.maps.Size(20, 20),
              }}
            />
          )}

          {selectedCenter && (
            <InfoWindow
              position={{ lat: selectedCenter.lat!, lng: selectedCenter.lng! }}
              onCloseClick={onInfoWindowClose}
            >
              <div className="max-w-xs p-2">
                <h3 className="text-lg font-bold text-blue-900">{selectedCenter.name}</h3>
                <p className="mt-1 text-sm">
                  <strong>Address:</strong> {selectedCenter.address}
                </p>
                <p className="text-sm">
                  <strong>City/Zip:</strong> {selectedCenter.cityZip}
                </p>
                <p className="text-sm">
                  <strong>Contact:</strong> {selectedCenter.contact}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Equipment:</strong>{" "}
                  {selectedCenter.demoCenterEquipments
                    .map((equip) => equip.equipment.name)
                    .join(", ")}
                </p>
                {selectedCenter.availability && (
                  <p className="text-sm">
                    <strong>Availability:</strong> {selectedCenter.availability}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapWithMarkers;
