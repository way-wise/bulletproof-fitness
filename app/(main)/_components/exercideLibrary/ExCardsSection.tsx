"use client";
import { TCardType } from "@/lib/dataTypes";
import ExLibraryCard from "./ExLibraryCard";
import FilterSection from "./FilterSection";

export const seedData: TCardType[] = [
  {
    id: 1,
    title: "SEATED HIGH ROW",
    category: "Back",
    equipment: "Bulletproof Fitness Equipment",
    views: 590,
    likes: 3,
    comments: 1,
    label: "Yellow",
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
    label: "Green",
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
    label: "Blue",
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
    label: "Red",
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
    label: "Orange",
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
    label: "Not Used",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/QKHxkZo9Yt8",
  },
  {
    id: 7,
    title: "SEATED HIGH ROW",
    category: "Back",
    equipment: "Bulletproof Fitness Equipment",
    views: 590,
    likes: 3,
    comments: 1,
    label: "Red",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/nSrE8o1yJAk",
  },
  {
    id: 8,
    title: "AB CRUNCH",
    category: "Abs",
    equipment: "Bulletproof Fitness Equipment",
    views: 1117,
    likes: 0,
    comments: 0,
    label: "Green",
    saves: 0,
    videoUrl: "https://www.youtube.com/embed/YEThZcfmok4",
  },
  {
    id: 9,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    label: "Blue",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/zyvf2MpLl3M",
  },
  {
    id: 10,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    label: "Red",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/acaW9SCxWJI",
  },
  {
    id: 11,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    label: "Orange",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/XEPTrmr8jik",
  },
  {
    id: 12,
    title: "CONCENTRATION CURL",
    category: "Biceps",
    equipment: "Bulletproof Fitness Equipment",
    views: 906,
    likes: 0,
    comments: 0,
    label: "Orange",
    saves: 1,
    videoUrl: "https://www.youtube.com/embed/QKHxkZo9Yt8",
  },
];
const ExCardsSection = () => {
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
                <ExLibraryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExCardsSection;
