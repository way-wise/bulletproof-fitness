"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Slider } from "@/components/ui/slider";
import { useBodyParts } from "@/hooks/useBodyParts";
import { useDebounce } from "@/hooks/useDebounce";
import { useEquipments } from "@/hooks/useEquipments";
import { useRacks } from "@/hooks/useRacks";
import { ExerciseLibraryFilters } from "@/lib/dataTypes";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ExerciseFiltersProps {
  onFiltersChange: (filters: ExerciseLibraryFilters) => void;
}

export default function ExerciseFilters({
  onFiltersChange,
}: ExerciseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for all filters
  const [rating, setRating] = useState(0);
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [selectedRacks, setSelectedRacks] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [heightRange, setHeightRange] = useState([85]);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to track previous filters to prevent infinite loops
  const prevFiltersRef = useRef<string>("");

  // Debounce search inputs
  const debouncedUsername = useDebounce(username, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { equipments } = useEquipments();
  const { bodyParts } = useBodyParts();
  const { racks } = useRacks();

  // Initialize filters from URL params
  useEffect(() => {
    const bodyPartIds =
      searchParams.get("bodyPartIds")?.split(",").filter(Boolean) || [];
    const equipmentIds =
      searchParams.get("equipmentIds")?.split(",").filter(Boolean) || [];
    const rackIds =
      searchParams.get("rackIds")?.split(",").filter(Boolean) || [];
    const usernameParam = searchParams.get("username") || "";
    const minRating = searchParams.get("minRating")
      ? parseInt(searchParams.get("minRating")!)
      : 0;
    const maxHeight = searchParams.get("maxHeight")
      ? parseInt(searchParams.get("maxHeight")!)
      : 85;
    const search = searchParams.get("search") || "";

    setSelectedBodyParts(bodyPartIds);
    setSelectedEquipments(equipmentIds);
    setSelectedRacks(rackIds);
    setUsername(usernameParam);
    setRating(minRating);
    setHeightRange([maxHeight]);
    setSearchQuery(search);
  }, [searchParams]);

  // Update URL and trigger filter change
  const updateFilters = useCallback(
    (newFilters: ExerciseLibraryFilters) => {
      const params = new URLSearchParams(searchParams);

      // Update URL params
      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, String(value));
          }
        } else {
          params.delete(key);
        }
      });

      // Update URL without refreshing the page
      router.push(`?${params.toString()}`, { scroll: false });

      // Notify parent component
      onFiltersChange(newFilters);
    },
    [router, searchParams, onFiltersChange],
  );

  // Effect to trigger filter updates when any filter changes
  useEffect(() => {
    const filters: ExerciseLibraryFilters = {
      bodyPartIds: selectedBodyParts,
      equipmentIds: selectedEquipments,
      rackIds: selectedRacks,
      username: debouncedUsername || undefined,
      minRating: rating > 0 ? rating : undefined,
      maxHeight: heightRange[0] < 85 ? heightRange[0] : undefined,
      search: debouncedSearchQuery || undefined,
    };

    const currentFiltersString = JSON.stringify(filters);

    // Only update if filters actually changed from previous state
    if (currentFiltersString !== prevFiltersRef.current) {
      prevFiltersRef.current = currentFiltersString;
      updateFilters(filters);
    }
  }, [
    selectedBodyParts,
    selectedEquipments,
    selectedRacks,
    debouncedUsername,
    rating,
    heightRange,
    debouncedSearchQuery,
  ]);

  const handleRatingClick = (star: number) => {
    setRating(rating === star ? 0 : star);
  };

  const handleReset = () => {
    setRating(0);
    setSelectedBodyParts([]);
    setSelectedEquipments([]);
    setSelectedRacks([]);
    setUsername("");
    setHeightRange([85]);
    setSearchQuery("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    rating > 0 ||
    selectedBodyParts.length > 0 ||
    selectedEquipments.length > 0 ||
    selectedRacks.length > 0 ||
    username.trim() !== "" ||
    heightRange[0] < 85 ||
    searchQuery.trim() !== "";

  return (
    <div className="bg-white px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="py-1 text-left text-[24px] font-extrabold uppercase">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            Reset All
          </Button>
        )}
      </div>
      <hr />
      <div className="mt-6 space-y-4">
        {/* Body Part Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Body Part</Label>
          <MultiSelect
            options={bodyParts.map((bodyPart) => ({
              value: bodyPart.id,
              label: bodyPart.name,
            }))}
            selected={selectedBodyParts}
            onChange={setSelectedBodyParts}
            placeholder="Filter by Body Part"
            className="w-full"
          />
        </div>

        {/* Equipment Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Equipment</Label>
          <MultiSelect
            options={equipments.map((equipment) => ({
              value: equipment.id,
              label: equipment.name,
            }))}
            selected={selectedEquipments || []}
            onChange={setSelectedEquipments}
            placeholder="Filter by Equipment"
            className="w-full"
          />
        </div>

        {/* Search Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Search Exercises</Label>
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm py-4 text-[14px]"
          />
        </div>

        {/* Ratings Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Ratings</Label>
          <div className="flex w-full space-x-4 rounded-sm border bg-white p-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${rating >= star ? "fill-yellow-500 stroke-yellow-500" : "stroke-gray-400"}`}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>
        </div>

        {/* Rack Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Rack</Label>
          <MultiSelect
            options={racks.map((rack) => ({
              value: rack.id,
              label: rack.name,
            }))}
            selected={selectedRacks}
            onChange={setSelectedRacks}
            placeholder="Filter By Rack"
            className="w-full"
          />
        </div>

        {/* Username Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Username</Label>
          <Input
            placeholder="Search by Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-sm py-4 text-[14px]"
          />
        </div>

        {/* Height Filter */}
        <div className="flex flex-col space-y-1">
          <Label className="text-left text-[16px] font-bold">
            Filter By Height (Max: {heightRange[0]} IN)
          </Label>
          <div className="pt-4">
            <Slider
              value={heightRange}
              onValueChange={setHeightRange}
              max={85}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="mt-1 text-[14px] text-gray-600">0 IN — 85 IN</div>
          </div>
        </div>
      </div>
    </div>
  );
}
