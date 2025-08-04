"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, Star, Video } from "lucide-react";

interface Stats {
  totalVideos?: number;
  totalViews?: number;
  totalLikes?: number;
  avgRating?: number;
}

interface StatsCardsProps {
  stats: Stats;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Total Videos</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalVideos || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Total Views</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Total Likes</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalLikes || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold">{stats?.avgRating || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
};
