import {
  ExerciseLibraryFilters,
  ExerciseLibraryItem,
  ExerciseLibraryResponse,
} from "@/lib/dataTypes";
import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";

interface UseInfiniteExerciseLibraryReturn {
  exercises: ExerciseLibraryItem[];
  meta: ExerciseLibraryResponse["meta"] | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | undefined;
  size: number;
  setSize: (size: number | ((_size: number) => number)) => Promise<ExerciseLibraryResponse[] | undefined>;
  isReachingEnd: boolean;
  mutate: () => Promise<ExerciseLibraryResponse[] | undefined>;
}

// Build query string from filters
const buildQueryString = (filters: ExerciseLibraryFilters, page: number): string => {
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
  
  // Always include page and limit for pagination
  params.append("page", page.toString());
  params.append("limit", (filters.limit || 12).toString());

  return params.toString();
};

// Fetcher function for SWR
const fetcher = async (url: string): Promise<ExerciseLibraryResponse> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Handle the response structure from the API
  if (result.success && result.data) {
    return {
      data: result.data,
      meta: result.meta,
    };
  }
  
  return result;
};

export const useInfiniteExerciseLibrary = (
  filters: ExerciseLibraryFilters = {},
): UseInfiniteExerciseLibraryReturn => {
  // Key generator function for useSWRInfinite
  const getKey = (pageIndex: number, previousPageData: ExerciseLibraryResponse | null) => {
    // If we've reached the end, don't fetch more
    if (previousPageData && previousPageData.data.length === 0) return null;
    
    // If we have previous data and it's less than the limit, we've reached the end
    const limit = filters.limit || 12;
    if (previousPageData && previousPageData.data.length < limit) return null;
    
    // Generate the API URL for this page (pageIndex is 0-based, but API expects 1-based)
    const queryString = buildQueryString(filters, pageIndex + 1);
    return `/api/exercise-library?${queryString}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<ExerciseLibraryResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateAll: false,
  });

  // Flatten all exercises from all pages
  const exercises = useMemo(() => {
    if (!data) return [];
    return data.flatMap(page => page.data);
  }, [data]);

  // Get meta from the latest page
  const meta = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data[data.length - 1].meta;
  }, [data]);

  // Check if we're loading the first page
  const isLoading = !error && !data;

  // Check if we're loading more pages
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  // Check if we've reached the end
  const isReachingEnd = useMemo(() => {
    if (!data) return false;
    const lastPage = data[data.length - 1];
    if (!lastPage) return false;
    
    const limit = filters.limit || 12;
    return lastPage.data.length < limit || exercises.length >= (meta?.total || 0);
  }, [data, exercises.length, meta?.total, filters.limit]);

  return {
    exercises,
    meta,
    isLoading: isLoading || false,
    isLoadingMore: isLoadingMore || false,
    error: error as Error | undefined,
    size,
    setSize,
    isReachingEnd,
    mutate,
  };
};
