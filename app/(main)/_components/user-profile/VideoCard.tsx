"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date-format";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  createdAt?: string;
  views?: number;
  likes?: number;
}

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : null;
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={getYouTubeThumbnail(video.videoUrl) || "/placeholder-video.svg"}
          alt={video.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{video.createdAt ? formatDate(video.createdAt) : "N/A"}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {video.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {video.likes || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
