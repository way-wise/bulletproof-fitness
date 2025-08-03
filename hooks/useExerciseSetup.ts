import {
  ExerciseLibraryFilters,
  ExerciseLibraryItem,
  ExerciseLibraryResponse,
} from "@/lib/dataTypes";
import { useCallback, useEffect, useState } from "react";

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
  const [data, setData] = useState<ExerciseLibraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const queryString = buildQueryString(filters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const url = `/api/exercise-setup${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle the response structure from the API
      if (result.success && result.data) {
        setData({
          data: result.data,
          meta: result.meta,
        });
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [queryString, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
