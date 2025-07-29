"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ExerciseFilters() {
  const [rating, setRating] = useState(0);

  return (
    <div className="bg-white px-4 py-6">
      <h2 className="text-left text-[24px] font-extrabold uppercase">
        Filters
      </h2>
      <hr />
      <div className="mt-6 space-y-4">
        {/* Body Part Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Body Part</Label>
          <Select>
            <SelectTrigger className="w-full rounded-sm py-4 text-[14px]">
              <SelectValue placeholder="Filter by Body Part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chest">Chest</SelectItem>
              <SelectItem value="back">Back</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Equipment</Label>
          <Select>
            <SelectTrigger className="w-full rounded-sm py-4 text-[14px]">
              <SelectValue placeholder="Filter by Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dumbbell">Dumbbell</SelectItem>
              <SelectItem value="barbell">Barbell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ratings Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Ratings</Label>
          <div className="flex w-full space-x-4 rounded-sm border bg-white p-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${rating >= star ? "fill-yellow-500 stroke-yellow-500" : "stroke-gray-400"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Rack Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Rack</Label>
          <Select>
            <SelectTrigger className="w-full rounded-sm py-4 text-[14px]">
              <SelectValue placeholder="Filter By Rack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rack-1">Rack 1</SelectItem>
              <SelectItem value="rack-2">Rack 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Username Filter */}
        <div className="flex flex-col items-start space-y-1">
          <Label className="text-[16px] font-bold">Filter By Username</Label>
          <Input
            placeholder="Search by Username..."
            className="w-full rounded-sm py-4 text-[14px]"
          />
        </div>

        {/* Height Filter */}
        <div className="flex flex-col space-y-1">
          <Label className="text-left text-[16px] font-bold">
            Filter By Height
          </Label>
          <div className="pt-4">
            <Slider
              defaultValue={[85]}
              max={85}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="mt-1 text-[14px] text-gray-600">0 IN — 85 IN</div>
          </div>
        </div>
      </div>
    </div>
  );
}
