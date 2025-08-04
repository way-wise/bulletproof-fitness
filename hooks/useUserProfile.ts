import { useSession } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  banned: boolean | null;
  image: string | null;
  role: string | null;
  emailVerified: boolean;
}

interface UserVideo {
  id: string;
  title: string;
  videoUrl: string;
  height: string | null;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  blocked: boolean;
  views: number;
  likes: number;
  rating: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  ExSetupEquipment: Array<{
    equipment: {
      id: string;
      name: string;
    };
  }>;
  ExSetupBodyPart: Array<{
    bodyPart: {
      id: string;
      name: string;
    };
  }>;
  ExSetupRak: Array<{
    rack: {
      id: string;
      name: string;
    };
  }>;
}

interface UserReward {
  id: string;
  points: number;
  createdAt: string;
  description: string | null;
  type: string;
  isActive: boolean;
  name: string | null;
}

interface ProfileStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  avgRating: number;
}

interface UseUserProfileReturn {
  user: UserProfile | null;
  videos: UserVideo[];
  rewards: UserReward[];
  stats: ProfileStats;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [rewards, setRewards] = useState<UserReward[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    avgRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user profile first
      const userResponse = await fetch("/api/users/me");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user videos and rewards in parallel
      const [videosResponse, rewardsResponse] = await Promise.all([
        fetch("/api/exercise-setup/user-videos"),
        fetch(`/api/users/${userData.id}/rewards`),
      ]);

      // Handle videos response
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        if (videosData.success) {
          setVideos(videosData.data || []);
        } else {
          console.error("Videos response error:", videosData);
        }
      } else {
        console.error("Videos request failed:", videosResponse.status);
      }

      // Handle rewards response
      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData.data || []);
      } else {
        console.error("Rewards request failed:", rewardsResponse.status);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Calculate stats whenever videos change
  useEffect(() => {
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
    const avgRating =
      videos.length > 0
        ? videos.reduce((sum, video) => sum + video.rating, 0) / videos.length
        : 0;

    setStats({
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      avgRating: Number(avgRating.toFixed(1)),
    });
  }, [videos]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    videos,
    rewards,
    stats,
    isLoading,
    error,
    mutate,
  };
};
