"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseLibraryVideo } from "@/lib/dataTypes";
import {
  ArrowLeft,
  Database,
  Dumbbell,
  Play,
  Ruler,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

// Responsive loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Skeleton className="h-9 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 sm:h-8 sm:w-64" />
          <Skeleton className="h-4 w-36 sm:w-48" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      {/* Main Content Skeleton */}
      <div className="space-y-4 sm:space-y-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <Skeleton className="mb-3 h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
            <Separator />
            <div>
              <Skeleton className="mb-3 h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-18" />
                <Skeleton className="h-6 w-22" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-4 sm:space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

interface ExerciseLibraryVideoDetailsProps {
  id: string;
}

export const ExerciseLibraryVideoDetails = ({
  id,
}: ExerciseLibraryVideoDetailsProps) => {
  const { data, error, isLoading } = useSWR<{ data: ExerciseLibraryVideo }>(
    `/api/exercise-library/dashboard/${id}`,
    fetcher,
    {
      onError: () => toast.error("Failed to load video details"),
    },
  );

  const video = data?.data;

  const parseJsonArray = (value: string | null) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const videoUrl = video?.videoUrl || "";
  const videoId =
    videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] || null;

  const equipmentArray = parseJsonArray(video?.equipment ?? null);
  const bodyPartArray = parseJsonArray(video?.bodyPart ?? null);
  const rackArray = parseJsonArray(video?.rack ?? null);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !video) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500 sm:h-16 sm:w-16" />
          <div className="mb-2 text-lg font-semibold text-red-600 sm:text-xl">
            Video not found
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            The requested video could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-4 duration-500 fade-in-0 sm:space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button variant="outline" size="sm" asChild className="w-fit">
            <Link href="/dashboard/exercise-library">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Exercise Library</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {video.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Exercise Library Video Details
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href={video.videoUrl} target="_blank">
            <Play className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Watch Video</span>
            <span className="sm:hidden">Watch</span>
          </Link>
        </Button>
      </div>

      {/* Responsive Main Content */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        {/* Video Preview - Takes full width on mobile, 2/3 on xl+ */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Play className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Exercise Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Info - Takes full width on mobile, 1/3 on xl+ */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                Exercise Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Equipment Section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-orange-600" />
                  <h3 className="text-sm font-semibold sm:text-base">
                    Equipment
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {equipmentArray.length > 0 ? (
                    equipmentArray.map((item, i) => (
                      <Badge
                        key={i}
                        className="bg-orange-100 text-xs text-orange-800 sm:text-sm"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No equipment specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Body Parts Section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-semibold sm:text-base">
                    Target Body Parts
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bodyPartArray.length > 0 ? (
                    bodyPartArray.map((item, i) => (
                      <Badge
                        key={i}
                        className="bg-red-100 text-xs text-red-800 sm:text-sm"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No body parts specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Height and Rack Section */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <h3 className="mb-1 flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <Ruler className="h-3 w-3 text-purple-600 sm:h-4 sm:w-4" />
                    Height
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {video.height || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <Database className="h-3 w-3 text-indigo-600 sm:h-4 sm:w-4" />
                    Rack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {rackArray.length > 0 ? (
                      rackArray.map((item, i) => (
                        <Badge
                          key={i}
                          className="bg-indigo-100 text-xs text-indigo-800 sm:text-sm"
                        >
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground sm:text-sm">
                        No rack specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
