"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseLibraryVideo } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle,
  Database,
  Dumbbell,
  Globe,
  Lock,
  Play,
  Ruler,
  Settings,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ExerciseLibraryVideoDetailsProps {
  id: string;
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-32" />
        <div>
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content Skeleton */}
      <div className="space-y-6 lg:col-span-2">
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
          <CardContent className="space-y-6">
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
      <div className="space-y-6">
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

export const ExerciseLibraryVideoDetails = ({
  id,
}: ExerciseLibraryVideoDetailsProps) => {
  const [video, setVideo] = useState<ExerciseLibraryVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/exercise-library/dashboard/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        setVideo(data.data);
      } catch (error) {
        toast.error("Failed to load video details");
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!video) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <div className="mb-2 text-lg text-red-600">Video not found</div>
          <p className="text-muted-foreground">
            The requested video could not be found.
          </p>
        </div>
      </div>
    );
  }

  const parseJsonArray = (value: string | null) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const equipmentArray = parseJsonArray(video.equipment);
  const bodyPartArray = parseJsonArray(video.bodyPart);
  const rackArray = parseJsonArray(video.rack);
  console.log(video.videoUrl);
  return (
    <div className="animate-in space-y-6 duration-500 fade-in-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/exercise-library">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exercise Library
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{video.title}</h1>
            <p className="text-muted-foreground">
              Exercise Library Video Details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Video
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Video Preview Card */}
          <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {/* <iframe
                    className="h-full w-full"
                    src={video.videoUrl.replace("watch?v=", "embed/")}
                    title="Exercise Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  /> */}

                <iframe
                  width="560"
                  height="315"
                  src={video.videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Exercise Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Equipment */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-orange-600" />
                  <h3 className="font-semibold">Equipment</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {equipmentArray.length > 0 ? (
                    equipmentArray.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No equipment specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Body Parts */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <h3 className="font-semibold">Target Body Parts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bodyPartArray.length > 0 ? (
                    bodyPartArray.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-red-100 text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No body parts specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Height and Rack */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold">Height</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {video.height || "Not specified"}
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4 text-indigo-600" />
                    <h3 className="font-semibold">Rack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rackArray.length > 0 ? (
                      rackArray.map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-800 transition-colors hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300"
                        >
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        No rack specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Publication Status */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  {video.isPublic ? (
                    <Globe className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium">Publication</span>
                </div>
                <Badge variant={video.isPublic ? "success" : "secondary"}>
                  {video.isPublic ? "Published" : "Private"}
                </Badge>
              </div>

              {/* Block Status */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  {video.blocked ? (
                    <Ban className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant={video.blocked ? "destructive" : "success"}>
                  {video.blocked ? "Blocked" : "Active"}
                </Badge>
              </div>

              {/* Block Reason */}
              {video.blockReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Block Reason
                    </span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {video.blockReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Video ID</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {video.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User ID</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {video.userId}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(video.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(video.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {/* <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start transition-colors hover:bg-green-50 dark:hover:bg-green-950/20"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              {video.blocked ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/20"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unblock Video
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block Video
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Video
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};
