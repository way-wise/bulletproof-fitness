import {
  ExerciseLibraryFilters,
  ExerciseLibraryResponse,
} from "@/lib/dataTypes";
import { Suspense } from "react";
import ExSetupCardsSection from "../_components/exercideLibrary/ExSetupCardsSection";

// Type for search params
type SearchParams = {
  bodyPartIds?: string;
  equipmentIds?: string;
  rackIds?: string;
  username?: string;
  minHeight?: string;
  maxHeight?: string;
  minRating?: string;
  search?: string;
  page?: string;
  limit?: string;
};

interface CardsPageProps {
  searchParams: SearchParams;
}

// Server-side data fetching function
async function getExerciseLibraryData(
  filters: ExerciseLibraryFilters,
): Promise<ExerciseLibraryResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();

    // Build query parameters
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

    const url = `${baseUrl}/api/exercise-setup${params.toString() ? `?${params.toString()}` : ""}`;

    const response = await fetch(url, {
      cache: "no-store", // For SSR to get fresh data
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch exercise library data:",
        response.statusText,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercise library data:", error);
    return null;
  }
}

const CardsPage = async ({ searchParams }: CardsPageProps) => {
  // Await searchParams before using
  const params = await searchParams;

  // Parse search params into filters
  const initialFilters: ExerciseLibraryFilters = {
    bodyPartIds: params.bodyPartIds?.split(",").filter(Boolean),
    equipmentIds: params.equipmentIds?.split(",").filter(Boolean),
    rackIds: params.rackIds?.split(",").filter(Boolean),
    username: params.username || undefined,
    minHeight: params.minHeight ? parseInt(params.minHeight) : undefined,
    maxHeight: params.maxHeight ? parseInt(params.maxHeight) : undefined,
    minRating: params.minRating ? parseInt(params.minRating) : undefined,
    search: params.search || undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch initial data server-side
  const initialData = await getExerciseLibraryData(initialFilters);
  console.log(initialData);
  return (
    <div className="text-center text-xl">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            Loading...
          </div>
        }
      >
        <ExSetupCardsSection
          initialData={initialData?.data}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  );
};

export default CardsPage;
