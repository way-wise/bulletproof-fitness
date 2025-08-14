"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Spinner from "@/components/ui/spinner";
import { useInfiniteExerciseSetup } from "@/hooks/useInfiniteExerciseSetup";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ExerciseLibraryFilters, ExerciseLibraryItem } from "@/lib/dataTypes";
import { useState, useEffect } from "react";
import ExLibraryCard from "./ExLibraryCard";
import FilterSection from "./FilterSection";

interface ExCardsSectionProps {
  initialData?: ExerciseLibraryItem[];
  initialFilters?: ExerciseLibraryFilters;
}

const ExSetupCardsSection = ({
  initialData,
  initialFilters,
}: ExCardsSectionProps) => {
  const [filters, setFilters] = useState<ExerciseLibraryFilters>(
    initialFilters || {},
  );

  const {
    exercises,
    meta,
    isLoading,
    isLoadingMore,
    error,
    size,
    setSize,
    isReachingEnd,
    mutate,
  } = useInfiniteExerciseSetup(filters);

  // Use initial data if loading and no current data
  const displayData = exercises.length > 0 ? exercises : initialData || [];

  // Intersection observer for infinite loading
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
    enabled:
      !isLoading && !isLoadingMore && !isReachingEnd && displayData.length > 0,
  });

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [isIntersecting, isLoadingMore, isReachingEnd, size, setSize]);

  const handleFiltersChange = (newFilters: ExerciseLibraryFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-red-600">
            Error Loading Exercises
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          {/* Sticky Sidebar */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-24 h-fit">
              <FilterSection onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-left text-lg font-bold text-gray-900 md:text-xl lg:text-3xl">
                EXERCISE SETUP
              </h1>
              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-md border bg-white px-2 py-1 text-sm transition-colors lg:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                      />
                    </svg>
                    Filter
                  </button>
                </DrawerTrigger>
                <DrawerContent side="right" className="w-80">
                  <DrawerHeader>
                    <div className="flex w-full items-center justify-between">
                      <DrawerTitle>Filters</DrawerTitle>
                      <DrawerClose asChild>
                        <button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="sr-only">Close</span>
                        </button>
                      </DrawerClose>
                    </div>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <FilterSection onFiltersChange={handleFiltersChange} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Loading State */}
            {isLoading && displayData.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            )}

            {/* No Results */}
            {!isLoading && displayData.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No exercises found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}

            {/* Exercise Cards Grid */}
            {displayData.length > 0 && (
              <div className="grid min-h-[80vh] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayData.map((item) => (
                  <ExLibraryCard
                    alreadyReacted={item.reactions?.[0]?.reaction || null}
                    type="setup"
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    url={item.videoUrl || ""}
                    bodypart={
                      (item.ExSetupBodyPart &&
                        item.ExSetupBodyPart[0]?.bodyPart.name) ||
                      ""
                    }
                    author={item.user?.name || ""}
                    views={
                      item.contentStats ? item.contentStats[0]?.totalViews : 0
                    }
                    likes={
                      item.contentStats ? item.contentStats[0]?.totalLikes : 0
                    }
                    averageRating={
                      item.contentStats ? item.contentStats[0]?.avgRating : 0
                    }
                    dislikes={
                      item.contentStats
                        ? item.contentStats[0]?.totalDislikes
                        : 0
                    }
                    mutate={mutate}
                  />
                ))}
              </div>
            )}

            {/* Loading More Indicator */}
            {isLoadingMore && size > 1 && (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-6 w-6" />
                <span className="ml-2 text-sm text-gray-600">
                  Loading more...
                </span>
              </div>
            )}

            {/* Intersection Observer Target */}
            <div ref={targetRef} className="h-4" />

            {/* Pagination Info */}
            {isReachingEnd && displayData.length > 0 && (
              <div className="mt-8 text-center text-xs text-gray-500">
                All videos loaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExSetupCardsSection;
