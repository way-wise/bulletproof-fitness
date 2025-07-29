import { Badge } from "@/components/ui/badge";
import { CardContent, Card as CardUI } from "@/components/ui/card";
import { TCardType } from "@/lib/dataTypes";
import { Eye, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

const ExLibraryCard = ({ item }: { item: TCardType }) => {
  return (
    <div>
      <CardUI className="overflow-hidden rounded-none border-none shadow-none">
        <div className="relative aspect-video rounded-none shadow-none">
          <iframe
            src={item.videoUrl}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
        <CardContent className="space-y-3 border-none p-4 text-left">
          {item.category && (
            <Badge className="rounded-full border border-gray-400 bg-transparent text-[16px] font-light text-primary">
              {item.category}
            </Badge>
          )}
          <p className="text-[16px] text-gray-500">{item.equipment}</p>

          <Link href={`/${item.id}`}>
            <h3 className="text-[20px] font-bold uppercase">{item.title}</h3>
          </Link>
          <div className="mt-[12px] flex items-center gap-6 text-[16px] text-primary">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {item.likes}
            </span>

            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" /> {item.comments}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" /> {item.saves}
            </span>
          </div>
        </CardContent>
      </CardUI>
    </div>
  );
};

export default ExLibraryCard;
