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
import { Progress } from "@/components/ui/progress";
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
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardOverviewPage = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
      description: "Active fitness enthusiasts",
    },
    {
      title: "Demo Centers",
      value: "24",
      change: "+3.2%",
      changeType: "positive",
      icon: Building2,
      color: "bg-green-500",
      description: "Franchise locations",
    },
    {
      title: "Equipment Items",
      value: "156",
      change: "+8.1%",
      changeType: "positive",
      icon: Dumbbell,
      color: "bg-purple-500",
      description: "Available equipment",
    },
    {
      title: "Exercise Videos",
      value: "1,234",
      change: "+15.3%",
      changeType: "positive",
      icon: Play,
      color: "bg-orange-500",
      description: "Library content",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "New user registered",
      user: "Sarah Johnson",
      time: "2 minutes ago",
      avatar: "SJ",
    },
    {
      id: 2,
      type: "center",
      action: "Demo center opened",
      location: "Downtown Fitness Hub",
      time: "1 hour ago",
      avatar: "DC",
    },
    {
      id: 3,
      type: "equipment",
      action: "New equipment added",
      item: "Progressive Resistance Machine",
      time: "3 hours ago",
      avatar: "EQ",
    },
    {
      id: 4,
      type: "video",
      action: "Exercise video uploaded",
      title: "Advanced Chest Workout",
      time: "5 hours ago",
      avatar: "EV",
    },
  ];

  const topPerformers = [
    {
      name: "Downtown Fitness Hub",
      location: "New York, NY",
      rating: 4.8,
      members: 342,
      growth: "+18%",
    },
    {
      name: "Elite Training Center",
      location: "Los Angeles, CA",
      rating: 4.7,
      members: 298,
      growth: "+15%",
    },
    {
      name: "Power House Gym",
      location: "Chicago, IL",
      rating: 4.6,
      members: 267,
      growth: "+12%",
    },
  ];

  const systemHealth = [
    { name: "Server Uptime", value: 99.8, status: "excellent" },
    { name: "Database Performance", value: 94.2, status: "good" },
    { name: "API Response Time", value: 87.5, status: "warning" },
    { name: "Storage Usage", value: 72.1, status: "good" },
  ];

  // const { data: session } = useSession();
  // if (!session) {
  //   return <AuthRequired />;
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Heres whats happening with your fitness platform
            today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
                    {activity.user ||
                      activity.location ||
                      activity.item ||
                      activity.title}
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
            {topPerformers.map((center, index) => (
              <div key={index} className="flex items-center space-x-3">
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
                    {center.rating}
                  </div>
                  <p className="text-xs font-medium text-green-600">
                    {center.growth}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.name}</span>
                  <span className="font-medium">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">0%</span>
                  <Badge
                    variant={
                      metric.status === "excellent"
                        ? "default"
                        : metric.status === "good"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Building2 className="h-5 w-5" />
                <span className="text-xs">New Center</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Dumbbell className="h-5 w-5" />
                <span className="text-xs">Add Equipment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Play className="h-5 w-5" />
                <span className="text-xs">Upload Video</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold">$124,563</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+23.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Sessions
                </p>
                <p className="text-2xl font-bold">1,847</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.5% from last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Support Tickets
                </p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-orange-600">
              <ArrowDownRight className="h-3 w-3" />
              <span>-8.2% from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
