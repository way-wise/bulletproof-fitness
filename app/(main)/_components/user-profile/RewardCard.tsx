"use client";

import { Card } from "@/components/ui/card";
import { UserReward } from "@/hooks/useUserProfile";
import { formatDate } from "@/lib/date-format";
import { Award, Eye, Heart, Star, ThumbsDown, Video } from "lucide-react";

interface RewardCardProps {
  reward: UserReward;
}

export const RewardCard = ({ reward }: RewardCardProps) => {
  const getRewardIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "VIEW":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "RATING":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "SETUP":
        return <Video className="h-4 w-4 text-green-500" />;
      case "DISLIKE":
        return <ThumbsDown className="h-4 w-4 text-gray-500" />;
      case "LIBRARY":
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getRewardIcon(reward.type)}
          <div>
            <p className="font-medium">{reward.name || reward.type}</p>
            <p className="text-sm text-muted-foreground">
              {reward.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">+{reward.points}</p>
          <p className="text-xs text-muted-foreground">
            {reward.createdAt ? formatDate(reward.createdAt) : "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
};
