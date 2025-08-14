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
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

interface ExerciseFiltersProps {
  onFiltersChange: (filters: ExerciseLibraryFilters) => void;
}

// Filter state type
interface FilterState {
  rating: number;
  selectedBodyParts: string[];
  selectedEquipments: string[];
  selectedRacks: string[];
  username: string;
  heightRange: number[];
  searchQuery: string;
}

// Filter actions
type FilterAction =
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_BODY_PARTS"; payload: string[] }
  | { type: "SET_EQUIPMENTS"; payload: string[] }
  | { type: "SET_RACKS"; payload: string[] }
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_HEIGHT_RANGE"; payload: number[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "RESET_ALL" }
  | { type: "INITIALIZE_FROM_URL"; payload: Partial<FilterState> };

// Initial state
const initialState: FilterState = {
  rating: 0,
  selectedBodyParts: [],
  selectedEquipments: [],
  selectedRacks: [],
  username: "",
  heightRange: [85],
  searchQuery: "",
};

// Reducer for managing filter state
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_BODY_PARTS":
      return { ...state, selectedBodyParts: action.payload };
    case "SET_EQUIPMENTS":
      return { ...state, selectedEquipments: action.payload };
    case "SET_RACKS":
      return { ...state, selectedRacks: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_HEIGHT_RANGE":
      return { ...state, heightRange: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "RESET_ALL":
      return initialState;
    case "INITIALIZE_FROM_URL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function ExerciseFiltersOptimized({
  onFiltersChange,
}: ExerciseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use reducer instead of multiple useState calls
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Stable callback reference
  const onFiltersChangeRef = useRef(onFiltersChange);
  onFiltersChangeRef.current = onFiltersChange;

  // Debounce search inputs
  const debouncedUsername = useDebounce(state.username, 500);
  const debouncedSearchQuery = useDebounce(state.searchQuery, 500);

  // Memoize data fetching hooks
  const { equipments } = useEquipments();
  const { bodyParts } = useBodyParts();
  const { racks } = useRacks();

  // Memoize filter options to prevent unnecessary re-renders
  const bodyPartOptions = useMemo(
    () =>
      bodyParts.map((bodyPart) => ({
        value: bodyPart.id,
        label: bodyPart.name,
      })),
    [bodyParts],
  );

  const equipmentOptions = useMemo(
    () =>
      equipments.map((equipment) => ({
        value: equipment.id,
        label: equipment.name,
      })),
    [equipments],
  );

  const rackOptions = useMemo(
    () =>
      racks.map((rack) => ({
        value: rack.id,
        label: rack.name,
      })),
    [racks],
  );

  // Initialize filters from URL params (only once)
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

    dispatch({
      type: "INITIALIZE_FROM_URL",
      payload: {
        selectedBodyParts: bodyPartIds,
        selectedEquipments: equipmentIds,
        selectedRacks: rackIds,
        username: usernameParam,
        rating: minRating,
        heightRange: [maxHeight],
        searchQuery: search,
      },
    });
  }, []); // Only run once on mount

  // Memoize current filters to prevent unnecessary recalculations
  const currentFilters = useMemo(
    (): ExerciseLibraryFilters => ({
      bodyPartIds: state.selectedBodyParts,
      equipmentIds: state.selectedEquipments,
      rackIds: state.selectedRacks,
      username: debouncedUsername || undefined,
      minRating: state.rating > 0 ? state.rating : undefined,
      maxHeight: state.heightRange[0] < 85 ? state.heightRange[0] : undefined,
      search: debouncedSearchQuery || undefined,
    }),
    [
      state.selectedBodyParts,
      state.selectedEquipments,
      state.selectedRacks,
      debouncedUsername,
      state.rating,
      state.heightRange,
      debouncedSearchQuery,
    ],
  );

  // Stable update function with throttling
  const updateFiltersThrottled = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;

      return (filters: ExerciseLibraryFilters) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const params = new URLSearchParams();

          // Update URL params efficiently
          Object.entries(filters).forEach(([key, value]) => {
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
            }
          });

          // Update URL without refreshing the page
          const newUrl = params.toString();
          const currentUrl = window.location.search.slice(1);

          if (newUrl !== currentUrl) {
            router.push(`?${newUrl}`, { scroll: false });
          }

          // Notify parent component
          onFiltersChangeRef.current(filters);
        }, 100); // Throttle URL updates
      };
    })(),
    [router],
  );

  // Effect to trigger filter updates (with memoized filters)
  const prevFiltersRef = useRef<string>("");
  useEffect(() => {
    const currentFiltersString = JSON.stringify(currentFilters);

    if (currentFiltersString !== prevFiltersRef.current) {
      prevFiltersRef.current = currentFiltersString;
      updateFiltersThrottled(currentFilters);
    }
  }, [currentFilters, updateFiltersThrottled]);

  // Memoized event handlers
  const handleRatingClick = useCallback(
    (star: number) => {
      dispatch({
        type: "SET_RATING",
        payload: state.rating === star ? 0 : star,
      });
    },
    [state.rating],
  );

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, []);

  const handleBodyPartsChange = useCallback((value: string[]) => {
    dispatch({ type: "SET_BODY_PARTS", payload: value });
  }, []);

  const handleEquipmentsChange = useCallback((value: string[]) => {
    dispatch({ type: "SET_EQUIPMENTS", payload: value });
  }, []);

  const handleRacksChange = useCallback((value: string[]) => {
    dispatch({ type: "SET_RACKS", payload: value });
  }, []);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_USERNAME", payload: e.target.value });
    },
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
    },
    [],
  );

  const handleHeightChange = useCallback((value: number[]) => {
    dispatch({ type: "SET_HEIGHT_RANGE", payload: value });
  }, []);

  // Memoize active filters check
  const hasActiveFilters = useMemo(
    () =>
      state.rating > 0 ||
      state.selectedBodyParts.length > 0 ||
      state.selectedEquipments.length > 0 ||
      state.selectedRacks.length > 0 ||
      state.username.trim() !== "" ||
      state.heightRange[0] < 85 ||
      state.searchQuery.trim() !== "",
    [state],
  );

  return (
    <div className="px-4">
      <div className="flex h-12 items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">
            Filter By Body Part
          </Label>
          <MultiSelect
            options={bodyPartOptions}
            selected={state.selectedBodyParts}
            onChange={handleBodyPartsChange}
            placeholder="Filter by Body Part"
            className="w-full"
          />
        </div>

        {/* Equipment Filter */}
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">
            Filter By Equipment
          </Label>
          <MultiSelect
            options={equipmentOptions}
            selected={state.selectedEquipments}
            onChange={handleEquipmentsChange}
            placeholder="Filter by Equipment"
            className="w-full"
          />
        </div>

        {/* Search Filter */}
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">Search Exercises</Label>
          <Input
            type="search"
            placeholder="Search exercises..."
            value={state.searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-sm py-4 text-[14px]"
          />
        </div>

        {/* Ratings Filter */}
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">Filter By Ratings</Label>
          <div className="flex w-full space-x-4 rounded-sm border bg-white p-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${
                  state.rating >= star
                    ? "fill-yellow-500 stroke-yellow-500"
                    : "stroke-gray-400"
                }`}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>
        </div>

        {/* Rack Filter */}
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">Filter By Rack</Label>
          <MultiSelect
            options={rackOptions}
            selected={state.selectedRacks}
            onChange={handleRacksChange}
            placeholder="Filter By Rack"
            className="w-full"
          />
        </div>

        {/* Username Filter */}
        <div className="flex flex-col items-start space-y-2">
          <Label className="text-[16px] font-semibold">
            Filter By Username
          </Label>
          <Input
            type="search"
            placeholder="Search by Username..."
            value={state.username}
            onChange={handleUsernameChange}
            className="w-full rounded-sm py-4 text-[14px]"
          />
        </div>

        {/* Height Filter */}
        <div className="flex flex-col space-y-2">
          <Label className="text-left text-[16px] font-semibold">
            Filter By Height (Max: {state.heightRange[0]} IN)
          </Label>
          <div className="pt-4">
            <Slider
              value={state.heightRange}
              onValueChange={handleHeightChange}
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
