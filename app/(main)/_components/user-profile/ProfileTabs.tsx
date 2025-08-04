"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/date-format";
import { Activity, Trophy, User, Video } from "lucide-react";
import Link from "next/link";
import { RewardCard } from "./RewardCard";
import { VideoCard } from "./VideoCard";

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  createdAt?: string;
  views?: number;
  likes?: number;
}

interface Reward {
  id: string;
  type: string;
  name?: string;
  description: string;
  points: number;
  createdAt?: string;
}

interface UserProfile {
  name?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  totalPoints?: number;
}

interface Stats {
  totalVideos?: number;
  totalViews?: number;
  totalLikes?: number;
  avgRating?: number;
}

interface ProfileTabsProps {
  user: UserProfile;
  videos: Video[];
  rewards: Reward[];
  stats: Stats;
  isLoading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ProfileTabs = ({
  user,
  videos,
  rewards,
  stats,
  isLoading,
  activeTab,
  onTabChange,
}: ProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span>
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Points:</span>
                    <span className="font-semibold text-green-600">
                      {user?.totalPoints || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>
                      Last active:{" "}
                      {user?.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-green-500" />
                    <span>{stats.totalVideos || 0} videos uploaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span>{stats.totalViews || 0} total views</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="videos" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              My Videos ({videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video" />
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Video className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No videos uploaded yet</p>
                <Link href="/upload-video">
                  <Button className="mt-4">Upload Your First Video</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rewards" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Reward History ({rewards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : rewards.length > 0 ? (
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No rewards earned yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start uploading videos and engaging with content to earn
                  points!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.slice(0, 5).map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <Video className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded{" "}
                      {video.createdAt ? formatDate(video.createdAt) : "N/A"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {video.views || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {video.likes || 0}
                    </div>
                  </div>
                </div>
              ))}
              {rewards.length > 0 &&
                rewards.slice(0, 5).map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Earned {reward.points} points
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reward.description || reward.type} -{" "}
                        {reward.createdAt
                          ? formatDate(reward.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                    <Badge variant="secondary">+{reward.points}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
