import { apiRequest } from "@/lib/request";
import useSWR, { SWRConfiguration } from "swr";

export interface ExerciseLibraryFilters {
  page?: number;
  limit?: number;
  search?: string;
  bodyPart?: string;
  equipment?: string;
  rack?: string;
  username?: string;
  minHeight?: number;
  maxHeight?: number;
  rating?: number;
  sortBy?: "title" | "createdAt" | "views" | "likes";
  sortOrder?: "asc" | "desc";
}

export interface ExerciseLibraryVideo {
  id: string;
  title: string;
  videoUrl: string;
  equipment: string[];
  bodyPart: string[];
  rack: string[];
  height: string | null;
  heightInInches: number | null;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  isPublic: boolean;
  blocked: boolean;
  blockReason: string | null;
  createdAt: string;
  updatedAt: string;
  // Mock data for demo
  views: number;
  likes: number;
  comments: number;
  saves: number;
  rating: string;
}

export interface ExerciseLibraryResponse {
  success: boolean;
  data: ExerciseLibraryVideo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const fetcher = async (url: string): Promise<ExerciseLibraryResponse> => {
  const response = await apiRequest(url, "GET");
  if (!response.data) {
    throw new Error("Failed to fetch exercise library");
  }
  return response.data as ExerciseLibraryResponse;
};

export const useExerciseLibrary = (
  filters: ExerciseLibraryFilters = {},
  options?: SWRConfiguration,
) => {
  const {
    page = 1,
    limit = 12,
    search = "",
    bodyPart = "",
    equipment = "",
    rack = "",
    username = "",
    minHeight = 0,
    maxHeight = 85,
    rating = 0,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  // Build query string
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    bodyPart,
    equipment,
    rack,
    username,
    minHeight: minHeight.toString(),
    maxHeight: maxHeight.toString(),
    rating: rating.toString(),
    sortBy,
    sortOrder,
  });

  const url = `/api/exercise-library/filtered?${queryParams.toString()}`;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ExerciseLibraryResponse>(url, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      ...options,
    });

  return {
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    isValidating,
    error,
    mutate,
    hasNextPage: data?.meta?.hasNextPage || false,
    hasPrevPage: data?.meta?.hasPrevPage || false,
    totalPages: data?.meta?.totalPages || 0,
    total: data?.meta?.total || 0,
  };
};

// Hook for fetching a single exercise by ID
export const useExerciseById = (
  id: string | null,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ExerciseLibraryResponse>(
      id ? `/api/exercise-library/${id}` : "",
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 300000, // 5 minutes
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        ...options,
      },
    );

  return {
    data: data?.data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
