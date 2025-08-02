import {
  ExerciseLibraryFilters,
  ExerciseLibraryItem,
  ExerciseLibraryResponse,
} from "@/lib/dataTypes";
import { useMemo } from "react";
import useSWR from "swr";

interface UseExerciseLibraryReturn {
  exercises: ExerciseLibraryItem[];
  meta: ExerciseLibraryResponse["meta"] | null;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
}

// Build query string from filters
const buildQueryString = (filters: ExerciseLibraryFilters): string => {
  const params = new URLSearchParams();

  if (filters.bodyPartIds?.length) {
    params.append("bodyPartIds", filters.bodyPartIds.join(","));
  }
  if (filters.equipmentIds?.length) {
    params.append("equipmentIds", filters.equipmentIds.join(","));
  }
  if (filters.rackIds?.length) {
    params.append("rackIds", filters.rackIds.join(","));
  }
  if (filters.username) {
    params.append("username", filters.username);
  }
  if (filters.minHeight !== undefined) {
    params.append("minHeight", filters.minHeight.toString());
  }
  if (filters.maxHeight !== undefined) {
    params.append("maxHeight", filters.maxHeight.toString());
  }
  if (filters.minRating !== undefined) {
    params.append("minRating", filters.minRating.toString());
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.page !== undefined) {
    params.append("page", filters.page.toString());
  }
  if (filters.limit !== undefined) {
    params.append("limit", filters.limit.toString());
  }

  return params.toString();
};

export const useExerciseSetup = (
  filters: ExerciseLibraryFilters = {},
): UseExerciseLibraryReturn => {
  const queryString = useMemo(() => buildQueryString(filters), [filters]);

  const { data, error, isLoading, mutate } = useSWR<ExerciseLibraryResponse>(
    `/api/exercise-setup${queryString ? `?${queryString}` : ""}`,

    {
      revalidateOnReconnect: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  return {
    exercises: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
};

// For backward compatibility
export const useExerciseData = useExerciseSetup;
