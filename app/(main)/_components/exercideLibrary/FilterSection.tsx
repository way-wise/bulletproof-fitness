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
import { useBodyParts } from "@/hooks/useBodyParts";
import { useEquipments } from "@/hooks/useEquipments";
import { useRacks } from "@/hooks/useRacks";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ExerciseFilters() {
  const [rating, setRating] = useState(0);
  const { equipments } = useEquipments();
  const { bodyParts } = useBodyParts();
  const { racks } = useRacks();

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
              {bodyParts.map((bodyPart) => (
                <SelectItem key={bodyPart.id} value={bodyPart.id}>
                  {bodyPart.name}
                </SelectItem>
              ))}
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
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
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
              {racks.map((rack) => (
                <SelectItem key={rack.id} value={rack.id}>
                  {rack.name}
                </SelectItem>
              ))}
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
