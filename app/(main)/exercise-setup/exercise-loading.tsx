import { Skeleton } from "@/components/ui/skeleton";

const ExerciseLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Desktop Filters Skeleton */}
          <div className="hidden lg:block lg:w-full lg:max-w-[280px]">
            <div className="sticky top-20">
              <div className="rounded-lg border bg-white px-4 py-6 shadow-sm">
                <Skeleton className="mb-4 h-8 w-24" />
                <Skeleton className="mb-6 h-px w-full" />

                <div className="space-y-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Header Skeleton */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Skeleton className="mb-2 h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24 lg:hidden" />
            </div>

            {/* Exercise Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border bg-white shadow-sm"
                >
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex items-center gap-6">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-8" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Skeleton className="h-10 w-20" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10" />
                ))}
              </div>
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLoading;
