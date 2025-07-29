import { Badge } from "@/components/ui/badge";
import { CardContent, Card as CardUI } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, Star } from "lucide-react";

const Card = ({ item }: { item: any }) => {
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
        <CardContent className="space-y-2 border-none p-4">
          {item.category && (
            <Badge className="rounded-none">{item.category}</Badge>
          )}
          <p className="text-sm text-gray-500">{item.equipment}</p>
          <h3 className="text-lg font-bold uppercase">{item.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {item.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" /> {item.comments}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" /> {item.saves}
            </span>
          </div>
        </CardContent>
      </CardUI>
    </div>
  );
};

export default Card;
