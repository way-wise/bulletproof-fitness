"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDashboard } from "@/hooks/useDashboard";
import type { auth } from "@/lib/auth";

import DashboardSkleton from "@/components/skeleton/dashboardSkleton";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  Clock,
  Dumbbell,
  MapPin,
  Play,
  Star,
  Users,
} from "lucide-react";
import { AuthRequired } from "../../../(main)/_components/user-profile/AuthRequired";

type Session = typeof auth.$Infer.Session;

const DashboardOverview = ({ session }: { session: Session }) => {
  const { data, isLoading } = useDashboard();

  if (!session) {
    return <AuthRequired />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your fitness platform
              today.
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Live
            </Badge>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
          </div> */}
        </div>

        <DashboardSkleton />
      </div>
    );
  }

  // Show data
  if (!data) {
    return null;
  }
  console.log(data);
  const { stats, recentActivities, topPerformingCenters } = data;

  // Prepare stats data for rendering
  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.userGrowth >= 0 ? "+" : ""}${stats.userGrowth}%`,
      changeType: stats.userGrowth >= 0 ? "positive" : "negative",
      icon: Users,
      color: "bg-blue-500",
      description: "Active fitness enthusiasts",
    },
    {
      title: "Demo Centers",
      value: stats.totalDemoCenters.toLocaleString(),
      change: `${stats.centerGrowth >= 0 ? "+" : ""}${stats.centerGrowth}%`,
      changeType: stats.centerGrowth >= 0 ? "positive" : "negative",
      icon: Building2,
      color: "bg-green-500",
      description: "Franchise locations",
    },
    {
      title: "Library Videos",
      value: stats.totalLibraryVideos.toLocaleString(),
      change: `${stats.libraryVideoGrowth >= 0 ? "+" : ""}${stats.libraryVideoGrowth}%`,
      changeType: stats.libraryVideoGrowth >= 0 ? "positive" : "negative",
      icon: Play,
      color: "bg-purple-500",
      description: "Library content",
    },
    {
      title: "Exercise Videos",
      value: stats.totalExerciseVideos.toLocaleString(),
      change: `${stats.videoGrowth >= 0 ? "+" : ""}${stats.videoGrowth}%`,
      changeType: stats.videoGrowth >= 0 ? "positive" : "negative",
      icon: Dumbbell,
      color: "bg-orange-500",
      description: "Exercise setup content",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", stat.color)}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "flex items-center",
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your fitness platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                    {activity.avatar}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.title}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Centers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Centers
            </CardTitle>
            <CardDescription>
              Best performing demo centers this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingCenters.map((center, index) => (
              <div key={center.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-xs font-medium text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {center.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {center.location}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {center.rating.toFixed(1)}
                  </div>
                  <p className="text-xs font-medium text-green-600">
                    +{center.growth}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
