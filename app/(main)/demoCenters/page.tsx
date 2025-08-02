"use client";

import { Button } from "@/components/ui/button";
import { CircleArrowRight, LocateFixed, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MapDemoCenter from "../_components/demo-centers/MapDemoCenter";
import DemoCentersCards from "../_components/demo-centers/DemoCentersCards";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";

interface DemoCenterFilters {
  location: string;
  buildingType: string;
  equipments: string[];
  range: number;
  page: number;
  limit: number;
}

export default function DemoCenterPage() {
  const [filters, setFilters] = useState<DemoCenterFilters>({
    location: "",
    buildingType: "",
    equipments: [],
    range: 5,
    page: 1,
    limit: 20,
  });

  const [isLocating, setIsLocating] = useState(false);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  // Get equipments
  const equipmentsUrl = `/api/equipments/all`;
  const {
    data: equipments,
    error: equipmentsError,
    isValidating: equipmentsIsValidating,
  } = useSWR(equipmentsUrl);

  // Get demo centers
  const demoCenterUrl = `/api/demo-centers?location=${filters.location}&buildingType=${filters.buildingType}&equipments=${filters.equipments?.join(",")}&range=${filters.range}&page=${filters.page}&limit=${filters.limit}`;
  const {
    data: demoCenters,
    error: demoCentersError,
    isValidating: demoCentersIsValidating,
  } = useSWR(demoCenterUrl);

  // Get User Location
  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat},${lng}`;
          updateFilters({ location: locationString });
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          console.error("Geolocation error:", error);
          toast("Location Access Denied");
          updateFilters({ location: "" });
        },
      );
    } else {
      toast("Geolocation not supported");
    }
  };

  return (
    <main className="container mx-auto max-w-[1200px] space-y-10 px-4 py-10">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">DEMO CENTER</h1>

        <Link href="/demoCenterForm">
          <Button className="cursor-pointer rounded-sm bg-[#69727D] px-2 py-2 text-xs text-white uppercase sm:text-base md:px-6 md:tracking-wide">
            <CircleArrowRight />
            Apply to be a demo center affiliate
          </Button>
        </Link>
      </section>

      {/* Map Section */}
      <MapDemoCenter
        data={demoCenters}
        isLoading={demoCentersIsValidating}
        error={demoCentersError}
      />

      {/* Search Location */}
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search Location, City, Zip..."
          value={filters.location}
          onChange={(e) => {
            updateFilters({ location: e.target.value });
          }}
          className="w-full py-6 pr-10"
        />
        {filters.location && (
          <button
            type="button"
            onClick={() => updateFilters({ location: "" })}
            className="absolute top-1/2 right-10 -translate-y-1/2 rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          disabled={isLocating}
          onClick={handleUseCurrentLocation}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <LocateFixed size={22} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Distance */}
        <div className="flex w-full items-center gap-2">
          <Select
            value={filters.range?.toString()}
            onValueChange={(value) => {
              updateFilters({ range: Number(value) });
            }}
          >
            <SelectTrigger className="w-full py-6">
              <SelectValue placeholder="Select Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 miles in radius</SelectItem>
              <SelectItem value="10">10 miles in radius</SelectItem>
              <SelectItem value="25">25 miles in radius</SelectItem>
              <SelectItem value="50">50 miles in radius</SelectItem>
              <SelectItem value="100">100 miles in radius</SelectItem>
              <SelectItem value="200">200 miles in radius</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Building Type */}
        <Select
          value={filters.buildingType}
          onValueChange={(value) => {
            updateFilters({ buildingType: value });
          }}
        >
          <SelectTrigger className="w-full py-6">
            <SelectValue placeholder="Select Building Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RESIDENTIAL">RESIDENTIAL</SelectItem>
            <SelectItem value="BUSINESS">BUSINESS</SelectItem>
          </SelectContent>
        </Select>

        {/* Equipments */}
        <MultiSelect
          options={
            equipments?.map((equipment: any) => ({
              value: equipment.id,
              label: equipment.name,
            })) || []
          }
          selected={(filters.equipments || []) as string[]}
          onChange={(value) => updateFilters({ equipments: value })}
          placeholder="Filter by Equipments"
          className="w-full"
          triggerClassName="py-6"
        />
      </div>

      {/* Listing Section */}
      <DemoCentersCards
        data={demoCenters}
        isLoading={demoCentersIsValidating}
        error={demoCentersError}
      />
    </main>
  );
}
