"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TBodyPart, TEquipment, TRack } from "@/lib/types/exerciseTypes";
import { ArrowLeft, Dumbbell, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

interface ExerciseSetupDetailsProps {
  id: string;
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
                  src={exerciseSetup.videoUrl}
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
                <div className="mb-3 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-orange-600" />
                  <h3 className="text-sm font-semibold sm:text-base">
                    Equipment
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exerciseSetup.ExSetupEquipment &&
                  exerciseSetup.ExSetupEquipment.length > 0 ? (
                    exerciseSetup.ExSetupEquipment.map(
                      (item: TEquipment, i: number) => (
                        <Badge
                          key={i}
                          className="bg-orange-100 text-xs text-orange-800 sm:text-sm"
                        >
                          {item?.equipment?.name}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No equipment specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Body Parts</h3>
                <div className="flex flex-wrap gap-2">
                  {exerciseSetup.ExSetupBodyPart &&
                  exerciseSetup.ExSetupBodyPart.length > 0 ? (
                    exerciseSetup.ExSetupBodyPart.map(
                      (item: TBodyPart, i: number) => (
                        <Badge
                          key={i}
                          className="bg-orange-100 text-xs text-orange-800 sm:text-sm"
                        >
                          {item?.bodyPart?.name}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
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
                  <div className="flex flex-wrap gap-2">
                    {exerciseSetup.ExSetupRak &&
                    exerciseSetup.ExSetupRak.length > 0 ? (
                      exerciseSetup.ExSetupRak.map((item: TRack, i: number) => (
                        <Badge
                          key={i}
                          className="bg-orange-100 text-xs text-orange-800 sm:text-sm"
                        >
                          {item?.rack?.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No rack specified
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
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Yellow:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.yellow}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.green && (
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Green:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.green}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.blue && (
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Blue:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.blue}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.red && (
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Red:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.red}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.purple && (
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Purple:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.purple}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.orange && (
                      <div className="flex justify-start gap-6">
                        <span className="text-sm">Orange:</span>
                        <span className="text-sm font-medium">
                          {exerciseSetup.orange}
                        </span>
                      </div>
                    )}
                    {exerciseSetup.isolatorHole && (
                      <div className="flex justify-start gap-6">
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
