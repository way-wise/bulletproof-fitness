"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date-format";
import { ExerciseSetup } from "@/prisma/generated/client";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ExerciseSetupDetailsProps {
  id: string;
}

export const ExerciseSetupDetails = ({ id }: ExerciseSetupDetailsProps) => {
  const [exerciseSetup, setExerciseSetup] = useState<ExerciseSetup | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/exercise-setup/dashboard/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        setExerciseSetup(data.data);
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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading video details...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Video not found</div>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/youtube-videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{video.title}</h1>
          <p className="text-muted-foreground">Video Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Video Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Video Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                <div className="text-center">
                  <p className="mb-2 text-muted-foreground">Video Preview</p>
                  <Button asChild>
                    <Link
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Watch on YouTube
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Information */}
          <Card>
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  {video.description || "No description available"}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.length > 0 ? (
                    video.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 font-semibold">Category</h3>
                  <p className="text-muted-foreground">{video.category}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Privacy</h3>
                  <Badge
                    variant={
                      video.privacy === "public" ? "success" : "secondary"
                    }
                  >
                    {video.privacy}
                  </Badge>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Status</h3>
                  <Badge
                    variant={
                      video.status === "uploaded"
                        ? "success"
                        : video.status === "processing"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {video.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Duration</h3>
                  <p className="text-muted-foreground">
                    {formatDuration(video.duration)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Published</span>
                <Badge variant={video.isPublic ? "success" : "secondary"}>
                  {video.isPublic ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Blocked</span>
                <Badge variant={video.blocked ? "destructive" : "secondary"}>
                  {video.blocked ? "Yes" : "No"}
                </Badge>
              </div>
              {video.blockReason && (
                <div>
                  <span className="text-sm font-medium">Block Reason</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {video.blockReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Views</span>
                <span className="font-semibold">
                  {video.viewCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Likes</span>
                <span className="font-semibold">
                  {video.likeCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Comments</span>
                <span className="font-semibold">
                  {video.commentCount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium">Video ID</span>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {video.videoId}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Upload Date</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(video.uploadDate)}
                </p>
              </div>
              {video.publishedAt && (
                <div>
                  <span className="text-sm font-medium">Published At</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(video.publishedAt)}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium">Created</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(video.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Last Updated</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(video.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          {video.user && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Name</span>
                  <p className="text-sm text-muted-foreground">
                    {video.user.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email</span>
                  <p className="text-sm text-muted-foreground">
                    {video.user.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
