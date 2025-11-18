"use client";

import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

interface LocationInputProps {
  value?: LocationData;
  onChange: (location: LocationData | null) => void;
  placeholder?: string;
  error?: boolean;
}

export default function LocationInput({
  value,
  onChange,
  placeholder = "Search for a location...",
  error = false,
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value?.address || "");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      console.log("[LocationInput] Initializing Google Places Autocomplete");

      // Initialize Google Places Autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode", "establishment"],
          fields: [
            "formatted_address",
            "geometry",
            "address_components",
            "place_id",
            "name",
          ],
        },
      );

      console.log("[LocationInput] Autocomplete initialized successfully");

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        console.log("[LocationInput] Place selected:", place);

        if (!place || !place.geometry || !place.geometry.location) {
          console.log("[LocationInput] Invalid place selected");
          onChange(null);
          return;
        }

        // Extract address components
        let city = "";
        let state = "";
        let country = "";
        let postalCode = "";

        place.address_components?.forEach((component) => {
          const types = component.types;
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
          if (types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        });

        const locationData: LocationData = {
          address: place.name || place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id,
          city,
          state,
          country,
          postalCode,
          formattedAddress: place.formatted_address,
        };

        console.log("[LocationInput] Location data extracted:", locationData);
        setInputValue(locationData.address);
        onChange(locationData);
      });
    }
  }, [isLoaded, onChange]);

  // Update input value when prop value changes
  useEffect(() => {
    if (value?.address) {
      setInputValue(value.address);
    }
  }, [value]);

  if (loadError) {
    return (
      <div>
        <div className="relative">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Error loading Google Maps"
            disabled
            className="pl-10"
          />
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>
        <div className="relative">
          <Loader2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          <Input
            type="search"
            placeholder="Loading..."
            disabled
            className="pl-10"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
        />
      </div>
      {value && value.city && value.state && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          📍 {value.city}, {value.state}
        </p>
      )}
    </div>
  );
}
