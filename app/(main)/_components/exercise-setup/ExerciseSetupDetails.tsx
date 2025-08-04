"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import ContactUs from "../exercide-library/ContactUs";
type TBodyPart = {
  bodyPart?: {
    name: string;
  };
};
type TEquipment = {
  equipment?: {
    name: string;
  };
};
type TRack = {
  rack?: {
    name: string;
  };
};

const pumpColors = [
  {
    key: "yellow",
    label: "Yellow",
    img: "/assets/seat-apd-pbn-1.webp",
    desc: "Set on the circle cam",
  },
  {
    key: "green",
    label: "Green",
    img: "/assets/lever-arm-pbn-2.webp",
    desc: "Set on the circle cam",
  },
  {
    key: "blue",
    label: "Blue",

    img: "/assets/lever-arm-pbn-1-1.webp",
    desc: "Attachment lever arm",
  },
  {
    key: "red",
    label: "Red",

    img: "/assets/weight-arm-lever-arm-png-1.webp",
    desc: "ISOLATOR lever arm hole position",
  },
  {
    key: "purple",
    label: "Purple",

    img: "/assets/lla-cam-pbn.png",
    desc: "Long Lever Arm circle cam",
  },
  {
    key: "orange",
    label: "Orange",

    img: "/assets/lla-arm-pbn.png",
    desc: "Long Lever Arm hole position",
  },
];
export default function ExerciseSetupDetails({
  exerciseSetupId,
}: {
  exerciseSetupId: string;
}) {
  const [rating, setRating] = useState(0);

  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch video");
      return res.json();
    });

  const { data, error, isLoading } = useSWR(
    exerciseSetupId ? `/api/exercise-setup/dashboard/${exerciseSetupId}` : null,
    fetcher,
  );
  const libraryData = data?.data;
  const videoUrl = libraryData?.videoUrl || "";
  const videoId =
    videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] || null;

  const handleSubmitRating = async (value: number) => {
    if (!exerciseSetupId) return;

    try {
      const res = await fetch("/api/action/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: exerciseSetupId,
          key: "setup",
          rating: value,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit rating");
      }

      setRating(value); // Set only after successful submission
      toast.success("Rating submitted successfully!");
    } catch (error: any) {
      console.error("Rating error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  console.log("libraryData", libraryData);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14 font-sans text-[17px] leading-relaxed text-[#222]">
      {/* Video & Info Section */}
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="aspect-video w-full overflow-hidden rounded shadow-md">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Exercise Video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="space-y-5">
          <h1 className="text-3xl leading-snug font-bold uppercase">
            {libraryData?.title}
          </h1>
          <ul className="space-y-1.5 text-[16px]">
            <li>
              <strong>Body Part:</strong>{" "}
              {libraryData?.ExSetupBodyPart?.map(
                (item: TBodyPart) => item?.bodyPart?.name,
              ).join(", ")}
            </li>
            <li>
              <strong>Equipment Used:</strong>{" "}
              {libraryData?.ExSetupEquipment?.map(
                (item: TEquipment) => item?.equipment?.name,
              ).join(", ")}
            </li>
            <li>
              <strong>User Height In Inches:</strong> 63
            </li>
            <li>
              <strong>Rack Used:</strong>{" "}
              {libraryData?.ExSetupRak?.map(
                (item: TRack) => item?.rack?.name,
              ).join(", ")}
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
          {pumpColors.map((item, i) => {
            const value = data?.[item.key as keyof typeof data];
            return (
              <Card key={i} className="border border-gray-300">
                <CardContent className="flex items-start gap-5 p-6">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="h-[64px] w-[52px] rounded object-cover"
                  />
                  <div className="text-base">
                    <p className="font-medium">
                      <span className="font-semibold">{item.label}</span>
                      {item.label !== "Not Used" && ` (${item.desc})`}:{" "}
                      <span className="ml-1 font-bold">
                        {value ?? "Not Used"}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-16 text-center">
        <p className="text-[20px] font-semibold">How useful was this post?</p>
        <p className="text-base text-gray-500">Click on a star to rate it!</p>

        <div className="flex justify-center gap-2 py-4">
          {libraryData?.ratings.length > 0 ? (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-7 w-7 cursor-pointer ${
                    s <= libraryData.ratings[0].rating
                      ? "fill-yellow-500 stroke-yellow-500"
                      : "stroke-gray-400"
                  }`}
                />
              ))}
            </div>
          ) : (
            [1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-7 w-7 cursor-pointer transition-colors ${
                  rating >= s
                    ? "fill-yellow-500 stroke-yellow-500"
                    : "stroke-gray-400"
                }`}
                onClick={() => handleSubmitRating(s)}
              />
            ))
          )}
        </div>

        <p className="text-base text-gray-500">
          No votes so far! Be the first to rate this post.
        </p>

        <ContactUs exerciseLibraryId={exerciseSetupId} />
      </div>
    </div>
  );
}
