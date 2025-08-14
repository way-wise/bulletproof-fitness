import prisma from "@/lib/prisma";

export interface DashboardStats {
  totalUsers: number;
  totalDemoCenters: number;
  totalLibraryVideos: number;
  totalExerciseVideos: number;
  userGrowth: number;
  centerGrowth: number;
  libraryVideoGrowth: number;
  videoGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: "user" | "center" | "video";
  action: string;
  title: string;
  time: string;
  avatar: string;
}

export interface TopPerformingCenter {
  id: string;
  name: string;
  location: string;
  rating: number;
  members: number;
  growth: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  topPerformingCenters: TopPerformingCenter[];
}

export const dashboardService = {
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    // OPTIMIZED: Remove redundant auth check (handled in module)
    // Get current date and 30 days ago for growth calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    // OPTIMIZED: Split into separate queries to reduce connection pool pressure
    // Get basic stats with simplified queries
    const [totalUsers, totalCenters, totalLibraryVideos, totalVideos] =
      await Promise.all([
        prisma.users.count(),
        prisma.demoCenter.count(),
        prisma.exerciseLibraryVideo.count(),
        prisma.exerciseSetup.count(),
      ]);

    // OPTIMIZED: Get growth data separately (less critical for dashboard load)
    const [currentUsers, currentCenters, currentLibraryVideos, currentVideos] =
      await Promise.all([
        prisma.users.count({
          where: { createdAt: { gte: currentMonthStart } },
        }),
        prisma.demoCenter.count({
          where: { createdAt: { gte: currentMonthStart } },
        }),
        prisma.exerciseLibraryVideo.count({
          where: { createdAt: { gte: currentMonthStart } },
        }),
        prisma.exerciseSetup.count({
          where: { createdAt: { gte: currentMonthStart } },
        }),
      ]);

    // OPTIMIZED: Get previous month data separately
    const [
      previousUsers,
      previousCenters,
      previousLibraryVideos,
      previousVideos,
    ] = await Promise.all([
      prisma.users.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      prisma.demoCenter.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      prisma.exerciseLibraryVideo.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      prisma.exerciseSetup.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
    ]);

    // OPTIMIZED: Get recent activities with minimal data
    const [
      recentUsers,
      recentCenters,
      recentLibraryVideos,
      recentVideos,
      topCenters,
    ] = await Promise.all([
      prisma.users.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
      prisma.demoCenter.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
      prisma.exerciseLibraryVideo.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.exerciseSetup.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.demoCenter.findMany({
        take: 3,
        where: {
          isPublic: true,
          blocked: false,
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          address: true,
          cityZip: true,
        },
      }),
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Combine recent activities
    const allActivities = [
      ...recentUsers.map((user) => ({
        id: user.id,
        type: "user" as const,
        action: "New user registered",
        title: user.name,
        time: user.createdAt,
        avatar: user.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
      })),
      ...recentCenters.map((center) => ({
        id: center.id,
        type: "center" as const,
        action: "Demo center opened",
        title: center.name,
        time: center.createdAt,
        avatar: "DC",
      })),
      ...recentLibraryVideos.map((video) => ({
        id: video.id,
        type: "video" as const,
        action: "Library video uploaded",
        title: video.title,
        time: video.createdAt,
        avatar: "LV",
      })),
      ...recentVideos.map((video) => ({
        id: video.id,
        type: "video" as const,
        action: "Exercise setup uploaded",
        title: video.title,
        time: video.createdAt,
        avatar: "ES",
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    // Format activities with relative time
    const formatRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    const recentActivities: RecentActivity[] = allActivities.map(
      (activity) => ({
        ...activity,
        time: formatRelativeTime(activity.time),
      }),
    );

    // Mock top performing centers data (in real app, this would come from actual metrics)
    const topPerformingCenters: TopPerformingCenter[] = topCenters.map(
      (center, index) => ({
        id: center.id,
        name: center.name,
        location: center.cityZip,
        rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
        members: 200 + Math.floor(Math.random() * 300), // Mock members between 200-500
        growth: 10 + Math.floor(Math.random() * 20), // Mock growth between 10-30%
      }),
    );

    const stats: DashboardStats = {
      totalUsers: totalUsers,
      totalDemoCenters: totalCenters,
      totalLibraryVideos: totalLibraryVideos,
      totalExerciseVideos: totalVideos,
      userGrowth: calculateGrowth(currentUsers, previousUsers),
      centerGrowth: calculateGrowth(currentCenters, previousCenters),
      libraryVideoGrowth: calculateGrowth(
        currentLibraryVideos,
        previousLibraryVideos,
      ),
      videoGrowth: calculateGrowth(currentVideos, previousVideos),
    };

    return {
      stats,
      recentActivities,
      topPerformingCenters,
    };
  },
};
