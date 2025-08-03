"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date-format";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

interface ExerciseSetupDetailsProps {
  id: string;
}

// Type for ExerciseSetup with user relation
interface ExerciseSetupWithUser {
  id: string;
  title: string;
  videoUrl: string;
  equipment: string | null;
  bodyPart: string | null;
  height: string | null;
  rack: string | null;
  userId: string;
  isPublic: boolean;
  blocked: boolean;
  blockReason: string | null;
  isolatorHole: string | null;
  yellow: string | null;
  green: string | null;
  blue: string | null;
  red: string | null;
  purple: string | null;
  orange: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch: ${response.status} ${errorData.message || ""}`,
    );
  }

  const data = await response.json();
  return data.data; // return only the `exerciseSetup` part
};

export const ExerciseSetupDetails = ({ id }: ExerciseSetupDetailsProps) => {
  const {
    data: exerciseSetup,
    error,
    isLoading,
  } = useSWR(id ? `/api/exercise-setup/dashboard/${id}` : null, fetcher, {
    onError: (err) => {
      console.error("Fetch error:", err);
      toast.error("Failed to load video details");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading video details...</div>
      </div>
    );
  }

  if (error || !exerciseSetup) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Video not found</div>
      </div>
    );
  }
  const videoUrl = exerciseSetup?.videoUrl || "";
  const videoId =
    videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/exercise-setup">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercise Setup
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {exerciseSetup.title}
          </h1>
          <p className="text-muted-foreground">Exercise Setup Details</p>
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
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Exercise Video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Information */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {exerciseSetup.equipment ? (
                    (() => {
                      try {
                        const equipmentArray = JSON.parse(
                          exerciseSetup.equipment,
                        );
                        return Array.isArray(equipmentArray) ? (
                          equipmentArray.map((item, index) => (
                            <Badge key={index} variant="secondary">
                              {item}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">
                            {exerciseSetup.equipment}
                          </Badge>
                        );
                      } catch {
                        return (
                          <Badge variant="secondary">
                            {exerciseSetup.equipment}
                          </Badge>
                        );
                      }
                    })()
                  ) : (
                    <span className="text-muted-foreground">
                      No equipment specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Body Parts</h3>
                <div className="flex flex-wrap gap-2">
                  {exerciseSetup.bodyPart ? (
                    (() => {
                      try {
                        const bodyPartArray = JSON.parse(
                          exerciseSetup.bodyPart,
                        );
                        return Array.isArray(bodyPartArray) ? (
                          bodyPartArray.map((item, index) => (
                            <Badge key={index} variant="secondary">
                              {item}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">
                            {exerciseSetup.bodyPart}
                          </Badge>
                        );
                      } catch {
                        return (
                          <Badge variant="secondary">
                            {exerciseSetup.bodyPart}
                          </Badge>
                        );
                      }
                    })()
                  ) : (
                    <span className="text-muted-foreground">
                      No body parts specified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 font-semibold">Height</h3>
                  <p className="text-muted-foreground">
                    {exerciseSetup.height || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Rack</h3>
                  <div className="flex flex-wrap gap-1">
                    {exerciseSetup.rack ? (
                      (() => {
                        try {
                          const rackArray = JSON.parse(exerciseSetup.rack);
                          return Array.isArray(rackArray) ? (
                            rackArray.map((item, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {item}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {exerciseSetup.rack}
                            </Badge>
                          );
                        } catch {
                          return (
                            <Badge variant="secondary" className="text-xs">
                              {exerciseSetup.rack}
                            </Badge>
                          );
                        }
                      })()
                    ) : (
                      <span className="text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pump Numbers */}
              {(exerciseSetup.yellow ||
                exerciseSetup.green ||
                exerciseSetup.blue ||
                exerciseSetup.red ||
                exerciseSetup.purple ||
                exerciseSetup.orange ||
                exerciseSetup.isolatorHole) && (
                <div>
                  <h3 className="mb-2 font-semibold">Pump Numbers</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {exerciseSetup.yellow && (
                      <div className="flex justify-between">
                        <span className="text-sm">Yellow:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.yellow}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.green && (
                      <div className="flex justify-between">
                        <span className="text-sm">Green:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.green}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.blue && (
                      <div className="flex justify-between">
                        <span className="text-sm">Blue:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.blue}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.red && (
                      <div className="flex justify-between">
                        <span className="text-sm">Red:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.red}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.purple && (
                      <div className="flex justify-between">
                        <span className="text-sm">Purple:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.purple}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.orange && (
                      <div className="flex justify-between">
                        <span className="text-sm">Orange:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.orange}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.isolatorHole && (
                      <div className="flex justify-between">
                        <span className="text-sm">Isolator Hole:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.isolatorHole}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                <Badge
                  variant={exerciseSetup.isPublic ? "success" : "secondary"}
                >
                  {exerciseSetup.isPublic ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Blocked</span>
                <Badge
                  variant={exerciseSetup.blocked ? "destructive" : "secondary"}
                >
                  {exerciseSetup.blocked ? "Yes" : "No"}
                </Badge>
              </div>
              {exerciseSetup.blockReason && (
                <div>
                  <span className="text-sm font-medium">Block Reason</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exerciseSetup.blockReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium">Exercise ID</span>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {exerciseSetup.id}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Created</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(exerciseSetup.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Last Updated</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(exerciseSetup.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          {exerciseSetup.user && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Name</span>
                  <p className="text-sm text-muted-foreground">
                    {exerciseSetup.user.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email</span>
                  <p className="text-sm text-muted-foreground">
                    {exerciseSetup.user.email}
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
