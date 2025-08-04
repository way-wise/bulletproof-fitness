import { Badge } from "@/components/ui/badge";
import { CardContent, Card as CardUI } from "@/components/ui/card";
import { ReactionType } from "@/prisma/generated/enums";
import { Eye, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

interface ExLibraryCardProps {
  id: string;
  title: string;
  url: string;
  bodypart: string;
  author: string;
  views: number;
  likes: number;
  averageRating: number;
  dislikes: number;
  type: "setup" | "lib";
  mutate?: () => void;
}

const ExLibraryCard = ({
  id,
  title,
  url,
  bodypart,
  author,
  views,
  likes,
  averageRating,
  dislikes,
  type,
  mutate,
}: ExLibraryCardProps) => {
  const videoUrl = url || "";
  const videoId =
    videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] || null;

  const handleReactSubmit = async ({
    contentId,
    key,
    type,
  }: {
    contentId: string;
    key: "setup" | "lib";
    type: ReactionType;
  }) => {
    try {
      const res = await fetch("/api/action/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId, key, type }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to record reaction");
      }

      // Revalidate the data to update the UI in real-time
      if (mutate) {
        mutate();
      }

      return result;
    } catch (error) {
      console.error("Reaction submit failed:", error);
      throw error;
    }
  };

  return (
    <div>
      <CardUI className="overflow-hidden rounded-none border-none shadow-none">
        <div className="relative aspect-video rounded-none shadow-none">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
        <CardContent className="space-y-3 border-none p-4 text-left">
          <Badge className="rounded-full border border-gray-400 bg-transparent text-[16px] font-light text-primary">
            {bodypart}
          </Badge>

          <p className="text-[16px] text-gray-500">{author}</p>

          <Link
            href={`${type === "setup" ? `/exercise-setup/${id}` : `/${id}`}`}
          >
            <h3 className="line-clamp-2 flex min-h-[60px] items-start text-[20px] font-bold uppercase">
              {title}
            </h3>
          </Link>
          <div className="mt-[12px] flex items-center gap-6 text-[16px] text-primary">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {views}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {averageRating}
            </span>

            <span
              className="flex cursor-pointer items-center gap-1"
              onClick={() =>
                handleReactSubmit({
                  contentId: id,
                  type: "LIKE",
                  key: type,
                })
              }
            >
              <ThumbsUp className="h-4 w-4" /> {likes}
            </span>
            <span
              className="flex cursor-pointer items-center gap-1"
              onClick={() =>
                handleReactSubmit({
                  contentId: id,
                  type: "DISLIKE",
                  key: type,
                })
              }
            >
              <ThumbsDown className="h-4 w-4" /> {dislikes}
            </span>
          </div>
        </CardContent>
      </CardUI>
    </div>
  );
};

export default ExLibraryCard;
