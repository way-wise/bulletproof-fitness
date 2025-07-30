"use client";
import { TCardType } from "@/lib/dataTypes";
import ExLibraryCard from "./ExLibraryCard";
import FilterSection from "./FilterSection";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

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
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="hidden lg:block lg:w-full lg:max-w-[250px]">
            <div className="sticky top-20">
              <FilterSection />
            </div>
          </div>

          <div className="w-full">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-left text-xl lg:text-3xl font-bold text-gray-900">
                EXERCISE LIBRARY
              </h1>
              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <button className="text-sm lg:hidden inline-flex items-center gap-2 text-gray-500 border px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                    Filter
                  </button>
                </DrawerTrigger>
                <DrawerContent side="right" className="w-80">
                  <DrawerHeader>
                    <div className="flex items-center justify-between w-full">
                      <DrawerTitle>Filters</DrawerTitle>
                      <DrawerClose asChild>
                        <button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="sr-only">Close</span>
                        </button>
                      </DrawerClose>
                    </div>
                  </DrawerHeader>
                  <div className="px-6 py-4 flex-1 overflow-y-auto">
                    <FilterSection />
                  </div>
                </DrawerContent>
              </Drawer>
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
