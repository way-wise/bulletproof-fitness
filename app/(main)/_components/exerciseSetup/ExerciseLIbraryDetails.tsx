"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Star } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ContactUs from "../exercideLibrary/ContactUs";

const pumpData = [
  { label: "Yellow", desc: "ISOLATOR seat/pad", value: 3 },
  {
    label: "Green",
    desc: "ISOLATOR lever arm, the number you have set on the circle cam",
    value: 6,
  },
  {
    label: "Blue",
    desc: "ISOLATOR lever arm, the hole number that the attachment is at",
    value: 3,
  },
  {
    label: "Red",
    desc: "ISOLATOR weight arm lever arm, the hole number that the weight arm is placed on",
    value: 4,
  },
  {
    label: "Orange",
    desc: "the hole number that the attachment is at on the lever arm",
    value: 5,
  },
  { label: "Not Used", desc: "", value: null },
];

export default function ExerciseDetailPage({
  exerciseLibraryId,
}: {
  exerciseLibraryId: string;
}) {
  const [rating, setRating] = useState(0);

  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch video");
      return res.json();
    });

  const { data, error, isLoading } = useSWR(
    exerciseLibraryId
      ? `/api/exercise-setup/dashboard/${exerciseLibraryId}`
      : null,
    fetcher,
  );
  const libraryData = data?.data;
  console.log(libraryData);
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14 font-sans text-[17px] leading-relaxed text-[#222]">
      {/* Video & Info Section */}
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="aspect-video w-full overflow-hidden rounded shadow-md">
          <iframe
            src={data?.videoUrl}
            title="Exercise Video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="space-y-5">
          <h1 className="text-3xl leading-snug font-bold uppercase">
            {data?.title}
          </h1>
          <ul className="space-y-1.5 text-[16px]">
            <li>
              <strong>Body Part:</strong>{" "}
              {libraryData?.bodyPart.map((item: string) => item).join(", ")}
            </li>
            <li>
              <strong>Equipment Used:</strong>{" "}
              {libraryData?.equipment.map((item: string) => item).join(", ")}
            </li>
            <li>
              <strong>User Height In Inches:</strong> 63
            </li>
            <li>
              <strong>Rack Used:</strong>{" "}
              {libraryData?.rack.map((item: string) => item).join(", ")}
            </li>
            <li>
              <strong>Note:</strong> For ISOLATOR videos, the number holes high
              the carriage is attached on the upright: <strong>2</strong>
            </li>
          </ul>
          <div className="rounded border bg-gray-100 px-4 py-3 text-base">
            Uploaded by: <strong>Bulletproof Fitness Equipment</strong>
          </div>
        </div>
      </div>

      {/* Pump-By-Numbers */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold uppercase">Pump-By-Numbers:</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {pumpData.map((item, i) => (
            <Card key={i} className="border border-gray-300">
              <CardContent className="flex items-start gap-5 p-6">
                <div className="h-[64px] w-[52px] flex-shrink-0 rounded bg-gray-200" />
                <div className="text-base">
                  <p className="font-medium">
                    <span className="font-semibold">{item.label}</span>
                    {item.label !== "Not Used" && ` (${item.desc})`}:
                    <span className="ml-1 font-bold">
                      {item.value ?? "Not Used"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-16 text-center">
        <p className="text-[20px] font-semibold">How useful was this post?</p>
        <p className="text-base text-gray-500">Click on a star to rate it!</p>

        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-7 w-7 cursor-pointer transition-colors ${rating >= s ? "fill-yellow-500 stroke-yellow-500" : "stroke-gray-400"}`}
              onClick={() => setRating(s)}
            />
          ))}
        </div>

        <p className="text-base text-gray-500">
          No votes so far! Be the first to rate this post.
        </p>

        <ContactUs exerciseLibraryId={exerciseLibraryId} />
      </div>
    </div>
  );
}
