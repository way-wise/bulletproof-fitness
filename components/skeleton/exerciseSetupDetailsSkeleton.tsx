import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseSetupDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14 font-sans text-[17px] leading-relaxed text-[#222]">
      {/* Video & Info Section */}
      <div className="grid items-start gap-10 md:grid-cols-2">
        {/* Video Skeleton */}
        <div className="aspect-video w-full overflow-hidden rounded shadow-md">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Info Section Skeleton */}
        <div className="space-y-5">
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-3/4" />

          {/* Info List Skeleton */}
          <ul className="space-y-1.5 text-[16px]">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </li>
            ))}
          </ul>

          {/* Uploaded by Skeleton */}
          <div className="rounded border bg-gray-100 px-4 py-3 text-base">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Pump-By-Numbers Section Skeleton */}
      <div className="mt-16">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="border border-gray-300">
              <CardContent className="flex items-start gap-5 p-6">
                <Skeleton className="h-[64px] w-[52px] rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback Section Skeleton */}
      <div className="mt-16 text-center">
        <Skeleton className="mx-auto mb-2 h-6 w-64" />
        <Skeleton className="mx-auto mb-4 h-4 w-48" />

        {/* Stars Skeleton */}
        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Skeleton key={star} className="h-7 w-7 rounded" />
          ))}
        </div>

        <Skeleton className="mx-auto h-4 w-56" />

        {/* Contact Us Skeleton */}
        <div className="mt-8 space-y-4">
          <Skeleton className="mx-auto h-8 w-32" />
          <div className="space-y-3">
            <Skeleton className="mx-auto h-4 w-48" />
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
