"use client";
import Card from "./Card";
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
  {
    id: 4,
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
    <div className="container mx-auto">
      <div className="mt-24">
        <FilterSection />
      </div>
      <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {seedData.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CardsSection;
