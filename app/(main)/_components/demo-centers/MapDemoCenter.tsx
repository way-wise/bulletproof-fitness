"use client";

import { useState, useEffect } from "react";
import GoogleMapWithMarkers from "./GoogleMapWithMarkers";

// Type for demo center from API
interface DemoCenterFromAPI {
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
}

const MapDemoCenter = () => {
  const [demoCenters, setDemoCenters] = useState<DemoCenterFromAPI[]>([]);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Fetch Google Maps API key from server
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/config/google-maps");
        if (!response.ok) {
          throw new Error("Failed to fetch API key");
        }
        const data = await response.json();
        setGoogleMapsApiKey(data.apiKey);
      } catch (err) {
        console.error("Error fetching Google Maps API key:", err);
        setApiKeyError(err instanceof Error ? err.message : "Failed to load API key");
      }
    };

    fetchApiKey();
  }, []);

  // Fetch demo centers from API
  useEffect(() => {
    const fetchDemoCenters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/demo-centers");
        if (!response.ok) {
          throw new Error("Failed to fetch demo centers");
        }
        const data = await response.json();
        setDemoCenters(data.data || []);
      } catch (err) {
        console.error("Error fetching demo centers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoCenters();
  }, []);



  return (
    <div>
      {/* API Key Error Display */}
      {apiKeyError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800">
              Google Maps Configuration Error
            </h3>
            <p className="text-sm text-red-700">
              {apiKeyError === "Failed to fetch API key" 
                ? "Please set GOOGLE_MAPS_API_KEY in your environment variables"
                : apiKeyError
              }
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full rounded border">
        {isLoading ? (
          <div className="flex h-[500px] w-full items-center justify-center bg-gray-100">
            <div className="text-center text-gray-600">
              <div className="mb-2 text-2xl">📍</div>
              <div className="text-lg font-semibold">Loading Demo Centers...</div>
              <div className="text-sm">Please wait while we fetch the locations</div>
            </div>
          </div>
        ) : googleMapsApiKey ? (
          <GoogleMapWithMarkers
            demoCenters={demoCenters}
            apiKey={googleMapsApiKey}
          />
        ) : (
          <div className="flex h-[500px] w-full items-center justify-center bg-gray-100">
            <div className="text-center text-gray-600">
              <div className="mb-2 text-2xl">🗺️</div>
              <div className="text-lg font-semibold">Loading Google Maps...</div>
              <div className="text-sm">Fetching API configuration</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDemoCenter;
