"use client";
import { TCardType } from "@/lib/dataTypes";
import Card from "./Card";
import FilterSection from "./FilterSection";
const seedData: TCardType[] = [
  {
    id: 1,
    title: "SEATED HIGH ROW",
    category: "Back",
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
    videoUrl: "https://www.youtube.com/embed/YEThZcfmok4",
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
    videoUrl: "https://www.youtube.com/embed/zyvf2MpLl3M",
  },
  {
    id: 4,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/acaW9SCxWJI",
  },
  {
    id: 5,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/XEPTrmr8jik",
  },
  {
    id: 6,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/QKHxkZo9Yt8",
  },
  {
    id: 1,
    title: "SEATED HIGH ROW",
    category: "Back",
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
    videoUrl: "https://www.youtube.com/embed/YEThZcfmok4",
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
    videoUrl: "https://www.youtube.com/embed/zyvf2MpLl3M",
  },
  {
    id: 4,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/acaW9SCxWJI",
  },
  {
    id: 5,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/XEPTrmr8jik",
  },
  {
    id: 6,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/QKHxkZo9Yt8",
  },
];
const CardsSection = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-8 xl:grid-cols-5">
          <div className="col-span-1">
            <div className="sticky top-20">
              <FilterSection />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 xl:col-span-4">
            <div className="mb-8">
              <h1 className="text-left text-3xl font-bold text-gray-900">
                EXERCISE LIBRARY
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {seedData.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsSection;
