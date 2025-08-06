import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkleton = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Profile Header Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar Skeleton */}
            <Skeleton className="h-24 w-24 rounded-full" />

            {/* Profile Info Skeleton */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Edit Button Skeleton */}
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Card>
        <CardContent className="p-6">
          {/* Tab Navigation Skeleton */}
          <div className="mb-6 flex space-x-6 border-b">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20" />
            ))}
          </div>

          {/* Tab Content Skeleton */}
          <div className="space-y-4">
            {/* Grid of content cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Skeleton className="h-32 w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkleton;
