"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ContactUs from "./ContactUs";
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
      ? `/api/exercise-library/dashboard/${exerciseLibraryId}`
      : null,
    fetcher,
  );
  const libraryData = data?.data;
  const videoUrl = libraryData?.videoUrl || "";
  const videoId =
    videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] || null;
  const handleSubmitRating = async (value: number) => {
    if (!exerciseLibraryId) return;

    try {
      const res = await fetch("/api/action/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: exerciseLibraryId,
          key: "lib",
          rating: value,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit rating");
      }

      setRating(value); // Set only after successful submission
      alert("Thanks for your rating!");
    } catch (error: any) {
      console.error("Rating error:", error);
      alert(error.message || "Something went wrong.");
    }
  };
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
              {libraryData?.ExLibBodyPart?.map(
                (item: TBodyPart) => item?.bodyPart?.name,
              ).join(", ")}
            </li>
            <li>
              <strong>Equipment Used:</strong>{" "}
              {libraryData?.ExLibEquipment?.map(
                (item: TEquipment) => item?.equipment?.name,
              ).join(", ")}
            </li>
            <li>
              <strong>User Height In Inches:</strong>{" "}
              {libraryData?.height || "N/A"}
            </li>
            <li>
              <strong>Rack Used:</strong>{" "}
              {libraryData?.ExLibRak?.map(
                (item: TRack) => item?.rack?.name,
              ).join(", ")}
            </li>
            <li>
              <strong>Note:</strong> For ISOLATOR videos, the number holes high
              the carriage is attached on the upright: <strong>2</strong>
            </li>
          </ul>
          <div className="rounded border bg-gray-100 px-4 py-3 text-base">
            Uploaded by: <strong>{libraryData?.user?.name}</strong>
          </div>
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
              onClick={() => handleSubmitRating(s)}
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
