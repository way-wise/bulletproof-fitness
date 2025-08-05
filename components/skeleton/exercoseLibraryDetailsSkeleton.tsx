import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseLibraryDetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-14 font-sans text-[17px] leading-relaxed text-[#222]">
      {/* Video & Info Section */}
      <div className="grid items-start gap-10 md:grid-cols-2">
        {/* Video Skeleton */}
        <div className="aspect-video w-full overflow-hidden rounded shadow-md">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Info Section Skeleton */}
        <div className="space-y-6">
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-[90%]" />

          {/* Info List Skeleton */}
          <ul className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <Skeleton className="h-5 w-[30%]" />
                <Skeleton className="h-5 w-[50%]" />
              </li>
            ))}
          </ul>

          {/* Uploaded by Skeleton */}
          <div className="rounded border bg-gray-100 px-4 py-4">
            <Skeleton className="h-5 w-[70%]" />
          </div>
        </div>
      </div>

      {/* Feedback Section Skeleton */}
      <div className="mt-16 text-center">
        <Skeleton className="mx-auto mb-3 h-6 w-[40%]" />
        <Skeleton className="mx-auto mb-6 h-4 w-[30%]" />

        {/* Stars Skeleton */}
        <div className="flex justify-center gap-3 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Skeleton key={star} className="h-7 w-7 rounded-full" />
          ))}
        </div>

        <Skeleton className="mx-auto h-4 w-[35%]" />

        {/* Contact Us Skeleton */}
        <div className="mt-10 space-y-5">
          <Skeleton className="mx-auto h-8 w-[25%]" />
          <div className="space-y-3">
            <Skeleton className="mx-auto h-4 w-[30%]" />
            <Skeleton className="mx-auto h-4 w-[25%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
