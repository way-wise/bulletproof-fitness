import { useSession } from "@/lib/auth-client";
import { ExerciseSetupVideo, UserProfile, UserReward } from "@/lib/dataTypes";
import useSWR from "swr";

// Extended type for user videos with stats
interface UserVideoWithStats extends ExerciseSetupVideo {
  views: number;
  likes: number;
  rating: number;
}

export const useUserProfile = () => {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
    mutate: mutateUser,
  } = useSWR<UserProfile>(userId ? `/api/users/me` : null);

  const {
    data: libVideos = [],
    error: libError,
    isLoading: isLibLoading,
    mutate: mutateLibVideos,
  } = useSWR<ExerciseSetupVideo[]>(
    userId ? `/api/exercise-library/videos` : null,
  );

  const {
    data: userVideosResponse,
    error: videosError,
    isLoading: isVideosLoading,
    mutate: mutateVideos,
  } = useSWR<{ data: UserVideoWithStats[] }>(
    userId ? `/api/exercise-setup/user-videos` : null,
  );

  const {
    data: rewardsResponse,
    error: rewardsError,
    isLoading: isRewardsLoading,
    mutate: mutateRewards,
  } = useSWR<{ data: UserReward[] }>(
    userId ? `/api/users/${userId}/rewards` : null,
  );

  const videos = userVideosResponse?.data ?? [];
  const rewards = rewardsResponse?.data ?? [];

  // stats calculate
  const totalViews = videos.reduce(
    (acc: number, v: UserVideoWithStats) => acc + v.views,
    0,
  );
  const totalLikes = videos.reduce(
    (acc: number, v: UserVideoWithStats) => acc + v.likes,
    0,
  );
  const avgRating =
    videos.length > 0
      ? Number(
          (
            videos.reduce(
              (acc: number, v: UserVideoWithStats) => acc + v.rating,
              0,
            ) / videos.length
          ).toFixed(1),
        )
      : 0;

  const stats = {
    totalVideos: videos.length,
    totalViews,
    totalLikes,
    avgRating,
  };

  // Combined mutate function to refresh all data
  const mutate = async () => {
    await Promise.all([
      mutateUser(),
      mutateLibVideos(),
      mutateVideos(),
      mutateRewards(),
    ]);
  };

  return {
    user,
    libVideos,
    videos,
    rewards,
    stats,
    isLoading:
      isUserLoading || isLibLoading || isVideosLoading || isRewardsLoading,
    error: userError || libError || videosError || rewardsError,
    mutate,
  };
};
