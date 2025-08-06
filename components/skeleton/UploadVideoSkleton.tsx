import { Skeleton } from "@/components/ui/skeleton";

const UploadVideoSkleton = () => {
  return (
    <div className="container py-12">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-12 md:w-3/4 md:flex-row">
        {/* First card skeleton */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[200px] w-[300px] rounded-lg" />
          <Skeleton className="h-10 w-[280px] rounded-sm" />
        </div>

        {/* Second card skeleton */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[200px] w-[300px] rounded-lg" />
          <Skeleton className="h-10 w-[280px] rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default UploadVideoSkleton;
