"use client";

import { Button } from "@/components/ui/button";
import { CircleArrowRight, LocateFixed } from "lucide-react";
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
import { MapPin } from "lucide-react";
import MapDemoCenter from "../_components/demo-centers/MapDemoCenter";
import DemoCentersCards from "../_components/demo-centers/DemoCentersCards";
import { DemoCenterQuery } from "@/schema/demoCenters";
import { PaginationQuery } from "@/schema/paginationSchema";
import { toast } from "sonner";

export default function DemoCenterPage() {
  // Filter state management following user table pattern
  const [filters, setFilters] = useState<DemoCenterQuery & PaginationQuery>({
    location: "",
    buildingType: "",
    equipment: "",
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
  const demoCenterUrl = `/api/demo-centers?location=${filters.location}&buildingType=${filters.buildingType}&equipment=${filters.equipment}&range=${filters.range}&page=${filters.page}&limit=${filters.limit}`;
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

      {/* Shared Filter Controls */}
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-x-4">
        {/* Search Location */}
        <div className="relative col-span-2">
          <Input
            type="text"
            placeholder="Search Location, City, Zip..."
            value={filters.location}
            onChange={(e) => {
              updateFilters({ location: e.target.value });
            }}
            className="w-full py-6 pr-10"
          />

          <button
            type="button"
            disabled={isLocating}
            onClick={handleUseCurrentLocation}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <LocateFixed size={24} />
          </button>
        </div>

        <div className="col-span-3 flex flex-col gap-4 md:flex-row">
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
                <SelectItem value="5">5mi</SelectItem>
                <SelectItem value="10">10mi</SelectItem>
                <SelectItem value="25">25mi</SelectItem>
                <SelectItem value="50">50mi</SelectItem>
                <SelectItem value="100">100mi</SelectItem>
                <SelectItem value="200">200mi</SelectItem>
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
          <Select
            value={filters.equipment}
            onValueChange={(value) => {
              updateFilters({ equipment: value });
            }}
          >
            <SelectTrigger className="w-full py-6">
              <SelectValue placeholder="Filter By Equipments" />
            </SelectTrigger>
            <SelectContent>
              {equipments?.map((equipment: any) => (
                <SelectItem key={equipment.id} value={equipment.name}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
