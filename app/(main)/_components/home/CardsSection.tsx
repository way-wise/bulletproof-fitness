"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, Star } from "lucide-react";
import FilterSection from "./FilterSection";
const seedData = [
  {
    id: 1,
    title: "SEATED HIGH ROW",
    category: null,
    equipment: "Bulletproof Fitness Equipment",
    views: 590,
    likes: 3,
    comments: 1,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/nSrE8o1yJAk",
  },
  {
    id: 2,
    title: "AB CRUNCH",
    category: "Abs",
    equipment: "Bulletproof Fitness Equipment",
    views: 1117,
    likes: 0,
    comments: 0,
    saves: 0,
    videoUrl: "https://www.youtube.com/embed/nSrE8o1yJAk",
  },
  {
    id: 3,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/W-nSrE8o1yJAk",
  },
];
const CardsSection = () => {
  return (
    <div>
      <FilterSection />
      <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {seedData.map((item) => (
          <Card key={item.id} className="overflow-hidden border">
            <div className="relative aspect-video">
              <iframe
                src={item.videoUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>
            <CardContent className="space-y-2 p-4">
              {item.category && <Badge>{item.category}</Badge>}
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardsSection;
