"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Medal,
  Award,
  Video,
  Eye,
  Heart,
  Star,
  Crown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { FormFieldset } from "@/components/ui/form";
import { toast } from "sonner";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalPoints: number;
  rank: number;
  exerciseSetupCount: number;
  exerciseLibraryCount: number;
  totalVideos: number;
  viewsCount: number;
  ratingsCount: number;
  likesCount: number;
  createdAt: string;
  isPlaceholder?: boolean;
}

interface LeaderboardData {
  data: LeaderboardUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const LeaderboardTable = () => {
  const [page, setPage] = useState(1);

  const url = `/api/users/leaderboard?page=${page}&limit=${50}`;
  const { data, isLoading, error } = useSWR<LeaderboardData>(url);

  const leaderboardData = data?.data || [];
  const totalUsers = data?.meta?.total || 0;

  // Show only top 5 if total users <= 5, otherwise show up to 50 with pagination
  const displayLimit = totalUsers <= 5 ? totalUsers : 50;
  const limitedData = leaderboardData.slice(0, displayLimit);

  const topThree = limitedData.slice(0, 3);
  const restOfUsers = limitedData.slice(3);

  // Generate placeholder items for empty positions (starting from rank 4)
  const generatePlaceholderUsers = (startRank: number, count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `placeholder-${startRank + index}`,
      name: "-",
      email: "-",
      image: "",
      totalPoints: 0,
      rank: startRank + index,
      exerciseSetupCount: 0,
      exerciseLibraryCount: 0,
      totalVideos: 0,
      viewsCount: 0,
      ratingsCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      isPlaceholder: true,
    }));
  };

  // Calculate starting rank for the table (after top 3)
  const tableStartRank = (page - 1) * 50 + 4;

  // Fill remaining slots with placeholders if needed (only for small datasets)
  const displayUsers = [...restOfUsers];

  // Only show placeholders when we have very few users (<= 5)
  if (totalUsers <= 5 && displayUsers.length < 2) {
    const placeholdersNeeded = 2 - displayUsers.length; // Show max 2 users in table (ranks 4-5)
    const startRankForPlaceholders = 4 + displayUsers.length;
    const placeholders = generatePlaceholderUsers(
      startRankForPlaceholders,
      placeholdersNeeded,
    );
    displayUsers.push(...placeholders);
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Trophy className="h-7 w-7 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600";
      case 2:
        return "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600";
      case 3:
        return "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">🏆 Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performers in our fitness community
          </p>
        </div>

        {/* Loading skeleton for podium */}
        <div className="mb-8 flex items-end justify-center gap-4">
          {[2, 1, 3].map((position) => (
            <div key={position} className="flex flex-col items-center">
              <Skeleton className="mb-4 h-20 w-20 rounded-full" />
              <Skeleton className="h-24 w-32 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Loading skeleton for list */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load leaderboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top performers in our fitness community
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="relative">
        <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-end sm:gap-8">
          {/* 2nd Place */}
          <div className="order-2 flex transform flex-col items-center sm:order-1 sm:translate-y-8">
            <div className="relative mb-6">
              <Avatar className="h-16 w-16 border-4 border-sky-400 shadow-lg sm:h-20 sm:w-20">
                <AvatarImage src={topThree[1]?.image} alt={topThree[1]?.name} />
                <AvatarFallback className="bg-gradient-to-br from-sky-100 to-sky-200 text-lg font-bold sm:text-xl">
                  {topThree[1]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow-lg">
                {getRankIcon(2)}
              </div>
            </div>
            <Card
              className={cn(
                "w-36 bg-gradient-to-br shadow-xl sm:w-44",
                getRankColor(2),
              )}
            >
              <CardContent className="p-4 text-center text-white sm:p-5">
                <div className="mb-2">
                  <div className="text-2xl font-bold text-sky-100 sm:text-3xl">
                    #2
                  </div>
                </div>
                <h3 className="mb-2 truncate text-sm font-bold text-white sm:text-lg">
                  {topThree[1]?.name || "-"}
                </h3>
                <p className="mb-1 text-2xl font-bold text-white sm:text-3xl">
                  {topThree[1] ? formatNumber(topThree[1].totalPoints) : "-"}
                </p>
                <p className="mb-3 text-xs text-sky-100 sm:text-sm">points</p>
                <div className="flex justify-center gap-2 text-xs text-sky-100 sm:gap-3 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{topThree[1]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>
                      {topThree[1] ? formatNumber(topThree[1].likesCount) : "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 1st Place - Bigger */}
          <div className="z-10 order-1 flex flex-col items-center sm:order-2">
            <div className="relative mb-6 sm:mb-8">
              <Avatar className="h-20 w-20 border-4 border-yellow-500 shadow-2xl sm:h-28 sm:w-28 sm:border-6">
                <AvatarImage src={topThree[0]?.image} alt={topThree[0]?.name} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-yellow-200 text-2xl font-bold sm:text-3xl">
                  {topThree[0]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow-xl sm:-top-4 sm:-right-4 sm:p-2">
                {getRankIcon(1)}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
                <div className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg sm:px-3 sm:text-sm">
                  CHAMPION
                </div>
              </div>
            </div>
            <Card
              className={cn(
                "w-44 border-2 border-yellow-400 bg-gradient-to-br shadow-2xl sm:w-52",
                getRankColor(1),
              )}
            >
              <CardContent className="p-4 text-center text-white sm:p-6">
                <div className="mb-2 sm:mb-3">
                  <div className="text-3xl font-bold text-yellow-100 sm:text-4xl">
                    #1
                  </div>
                </div>
                <h3 className="mb-2 truncate text-lg font-bold text-white sm:mb-3 sm:text-xl">
                  {topThree[0]?.name || "-"}
                </h3>
                <p className="mb-1 text-3xl font-bold text-white sm:mb-2 sm:text-4xl">
                  {topThree[0] ? formatNumber(topThree[0].totalPoints) : "-"}
                </p>
                <p className="mb-3 text-sm text-yellow-100 sm:mb-4 sm:text-base">
                  points
                </p>
                <div className="flex justify-center gap-3 text-xs text-yellow-100 sm:gap-4 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{topThree[0]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {topThree[0] ? formatNumber(topThree[0].likesCount) : "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3rd Place */}
          <div className="order-3 flex transform flex-col items-center sm:order-3 sm:translate-y-8">
            <div className="relative mb-6">
              <Avatar className="h-16 w-16 border-4 border-rose-400 shadow-lg sm:h-20 sm:w-20">
                <AvatarImage src={topThree[2]?.image} alt={topThree[2]?.name} />
                <AvatarFallback className="bg-gradient-to-br from-rose-100 to-rose-200 text-lg font-bold sm:text-xl">
                  {topThree[2]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow-lg">
                {getRankIcon(3)}
              </div>
            </div>
            <Card
              className={cn(
                "w-36 bg-gradient-to-br shadow-xl sm:w-44",
                getRankColor(3),
              )}
            >
              <CardContent className="p-4 text-center text-white sm:p-5">
                <div className="mb-2">
                  <div className="text-2xl font-bold text-rose-100 sm:text-3xl">
                    #3
                  </div>
                </div>
                <h3 className="mb-2 truncate text-sm font-bold text-white sm:text-lg">
                  {topThree[2]?.name || "-"}
                </h3>
                <p className="mb-1 text-2xl font-bold text-white sm:text-3xl">
                  {topThree[2] ? formatNumber(topThree[2].totalPoints) : "-"}
                </p>
                <p className="mb-3 text-xs text-rose-100 sm:text-sm">points</p>
                <div className="flex justify-center gap-2 text-xs text-rose-100 sm:gap-3 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{topThree[2]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>
                      {topThree[2] ? formatNumber(topThree[2].likesCount) : "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rest of the leaderboard */}
      <Card className="mt-20">
        <CardHeader className="flex justify-between gap-2">
          <CardTitle className="flex gap-2 text-left">
            <Trophy className="size-5" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayUsers.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between rounded-xl border-2 p-5 transition-all duration-200 ${
                  user.isPlaceholder
                    ? "border-muted/50 bg-muted/20"
                    : "hover:border-primary/20 hover:bg-gradient-to-r hover:from-background hover:to-muted/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
                      user.isPlaceholder
                        ? "border-muted/50 bg-muted/30 text-muted-foreground"
                        : "border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-primary"
                    }`}
                  >
                    #{user.rank}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-muted shadow-sm">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback
                      className={`font-semibold ${
                        user.isPlaceholder
                          ? "bg-muted/30 text-muted-foreground"
                          : "bg-gradient-to-br from-primary/10 to-primary/5"
                      }`}
                    >
                      {user.isPlaceholder
                        ? "?"
                        : user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`truncate text-lg font-bold ${
                        user.isPlaceholder ? "text-muted-foreground" : ""
                      }`}
                    >
                      {user.name}
                    </h4>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        user.isPlaceholder
                          ? "text-muted-foreground"
                          : "text-primary"
                      }`}
                    >
                      {user.isPlaceholder
                        ? "-"
                        : formatNumber(user.totalPoints)}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      points
                    </p>
                  </div>
                  <div className="hidden items-center gap-6 text-sm md:flex">
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        user.isPlaceholder
                          ? "border border-muted/50 bg-muted/20"
                          : "bg-blue-50 dark:bg-blue-950/30"
                      }`}
                    >
                      <Video
                        className={`h-4 w-4 ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {user.isPlaceholder ? "-" : user.totalVideos}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        user.isPlaceholder
                          ? "border border-muted/50 bg-muted/20"
                          : "bg-green-50 dark:bg-green-950/30"
                      }`}
                    >
                      <Eye
                        className={`h-4 w-4 ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-green-600"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {user.isPlaceholder
                          ? "-"
                          : formatNumber(user.viewsCount)}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        user.isPlaceholder
                          ? "border border-muted/50 bg-muted/20"
                          : "bg-red-50 dark:bg-red-950/30"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-red-600"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {user.isPlaceholder
                          ? "-"
                          : formatNumber(user.likesCount)}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        user.isPlaceholder
                          ? "border border-muted/50 bg-muted/20"
                          : "bg-yellow-50 dark:bg-yellow-950/30"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-yellow-600"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          user.isPlaceholder
                            ? "text-muted-foreground"
                            : "text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {user.isPlaceholder
                          ? "-"
                          : formatNumber(user.ratingsCount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Only show when there are more than 5 users */}
          {totalUsers > 5 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="rounded-md border px-4 py-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page}{" "}
                {data?.meta
                  ? `of ${Math.max(1, data.meta?.totalPages || 1)}`
                  : "of 1"}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!data?.meta || page >= (data.meta?.totalPages || 1)}
                className="rounded-md border px-4 py-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardTable;
