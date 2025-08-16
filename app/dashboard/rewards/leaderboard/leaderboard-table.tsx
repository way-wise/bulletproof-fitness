"use client";

import { useState } from "react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const limit = 50;

  const { data, isLoading, error } = useSWR<LeaderboardData>(
    `/api/users/leaderboard?page=${page}&limit=${limit}`
  );

  const leaderboardData = data?.data || [];
  const totalUsers = data?.meta.total || 0;

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

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
          <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-muted-foreground">Top performers in our fitness community</p>
        </div>
        
        {/* Loading skeleton for podium */}
        <div className="flex justify-center items-end gap-4 mb-8">
          {[2, 1, 3].map((position) => (
            <div key={position} className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full mb-4" />
              <Skeleton className="w-32 h-24 rounded-lg" />
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
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load leaderboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top performers in our fitness community</p>
      </div>

      {/* Top 3 Podium */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-6 sm:gap-8 mb-12">
          {/* 2nd Place */}
          <div className="flex flex-col items-center transform sm:translate-y-8 order-2 sm:order-1">
            <div className="relative mb-6">
              <Avatar className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-sky-400 shadow-lg">
                <AvatarImage src={topThree[1]?.image} alt={topThree[1]?.name} />
                <AvatarFallback className="text-lg sm:text-xl font-bold bg-gradient-to-br from-sky-100 to-sky-200">
                  {topThree[1]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg">
                {getRankIcon(2)}
              </div>
            </div>
            <Card className={cn("w-36 sm:w-44 bg-gradient-to-br shadow-xl", getRankColor(2))}>
              <CardContent className="p-4 sm:p-5 text-center text-white">
                <div className="mb-2">
                  <div className="text-2xl sm:text-3xl font-bold text-sky-100">#2</div>
                </div>
                <h3 className="font-bold text-sm sm:text-lg truncate mb-2 text-white">{topThree[1]?.name || "-"}</h3>
                <p className="text-2xl sm:text-3xl font-bold mb-1 text-white">{topThree[1] ? formatNumber(topThree[1].totalPoints) : "-"}</p>
                <p className="text-xs sm:text-sm text-sky-100 mb-3">points</p>
                <div className="flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-sky-100">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{topThree[1]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{topThree[1] ? formatNumber(topThree[1].likesCount) : "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 1st Place - Bigger */}
          <div className="flex flex-col items-center z-10 order-1 sm:order-2">
            <div className="relative mb-6 sm:mb-8">
              <Avatar className="w-20 sm:w-28 h-20 sm:h-28 border-4 sm:border-6 border-yellow-500 shadow-2xl">
                <AvatarImage src={topThree[0]?.image} alt={topThree[0]?.name} />
                <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-yellow-100 to-yellow-200">
                  {topThree[0]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-white rounded-full p-1 sm:p-2 shadow-xl">
                {getRankIcon(1)}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  CHAMPION
                </div>
              </div>
            </div>
            <Card className={cn("w-44 sm:w-52 bg-gradient-to-br shadow-2xl border-2 border-yellow-400", getRankColor(1))}>
              <CardContent className="p-4 sm:p-6 text-center text-white">
                <div className="mb-2 sm:mb-3">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-100">#1</div>
                </div>
                <h3 className="font-bold text-lg sm:text-xl truncate mb-2 sm:mb-3 text-white">{topThree[0]?.name || "-"}</h3>
                <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-white">{topThree[0] ? formatNumber(topThree[0].totalPoints) : "-"}</p>
                <p className="text-sm sm:text-base text-yellow-100 mb-3 sm:mb-4">points</p>
                <div className="flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-yellow-100">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{topThree[0]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{topThree[0] ? formatNumber(topThree[0].likesCount) : "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center transform sm:translate-y-8 order-3 sm:order-3">
            <div className="relative mb-6">
              <Avatar className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-rose-400 shadow-lg">
                <AvatarImage src={topThree[2]?.image} alt={topThree[2]?.name} />
                <AvatarFallback className="text-lg sm:text-xl font-bold bg-gradient-to-br from-rose-100 to-rose-200">
                  {topThree[2]?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg">
                {getRankIcon(3)}
              </div>
            </div>
            <Card className={cn("w-36 sm:w-44 bg-gradient-to-br shadow-xl", getRankColor(3))}>
              <CardContent className="p-4 sm:p-5 text-center text-white">
                <div className="mb-2">
                  <div className="text-2xl sm:text-3xl font-bold text-rose-100">#3</div>
                </div>
                <h3 className="font-bold text-sm sm:text-lg truncate mb-2 text-white">{topThree[2]?.name || "-"}</h3>
                <p className="text-2xl sm:text-3xl font-bold mb-1 text-white">{topThree[2] ? formatNumber(topThree[2].totalPoints) : "-"}</p>
                <p className="text-xs sm:text-sm text-rose-100 mb-3">points</p>
                <div className="flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-rose-100">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{topThree[2]?.totalVideos || "-"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{topThree[2] ? formatNumber(topThree[2].likesCount) : "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rest of the leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {restOfUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-5 rounded-xl border-2 hover:border-primary/20 hover:bg-gradient-to-r hover:from-background hover:to-muted/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 text-lg font-bold text-primary">
                    #{user.rank}
                  </div>
                  <Avatar className="w-12 h-12 border-2 border-muted shadow-sm">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="font-semibold bg-gradient-to-br from-primary/10 to-primary/5">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-lg truncate">{user.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-bold text-2xl text-primary">{formatNumber(user.totalPoints)}</p>
                    <p className="text-sm text-muted-foreground font-medium">points</p>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-lg">
                      <Video className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">{user.totalVideos}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">{formatNumber(user.viewsCount)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-700 dark:text-red-300">{formatNumber(user.likesCount)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-2 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-300">{formatNumber(user.ratingsCount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} of {data.meta.totalPages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.meta.totalPages}
                className="px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
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
