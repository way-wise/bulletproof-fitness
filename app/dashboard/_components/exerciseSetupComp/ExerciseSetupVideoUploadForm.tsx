"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBodyParts } from "@/hooks/useBodyParts";
import { useEquipments } from "@/hooks/useEquipments";
import { useRacks } from "@/hooks/useRacks";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import * as z from "zod";

// Helper for pump numbers
const pumpNumbers = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL"),
  title: z.string().min(1, "Video title is required"),
  equipment: z.array(z.string()),
  bodyPart: z.array(z.string()),
  height: z.string().optional(),
  rack: z.array(z.string()),
  isolatorHole: z.string().optional(),
  yellow: z.string().optional(),
  green: z.string().optional(),
  blue: z.string().optional(),
  red: z.string().optional(),
  purple: z.string().optional(),
  orange: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExerciseSetupVideoUploadForm({
  setAddExerciseModalOpen,
  mutateUrl,
}: {
  setAddExerciseModalOpen: (value: boolean) => void;
  mutateUrl: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { bodyParts } = useBodyParts();
  const { racks } = useRacks();
  const { equipments } = useEquipments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
      equipment: [],
      bodyPart: [],
      height: "",
      rack: [],
      isolatorHole: "",
      yellow: "",
      green: "",
      blue: "",
      red: "",
      purple: "",
      orange: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      // Send arrays directly to backend
      const submitData = {
        ...data,
        equipment: data.equipment.length > 0 ? data.equipment : [],
        bodyPart: data.bodyPart.length > 0 ? data.bodyPart : [],
        rack: data.rack.length > 0 ? data.rack : [],
      };

      const response = await fetch("/api/exercise-setup/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit video data");
      }

      toast.success("Setup video submitted successfully!");
      form.reset();

      // Revalidate the exercise library data to show the new entry
      mutate(mutateUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsUploading(false);
      setAddExerciseModalOpen(false);
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Video URL */}
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Setup Video Link *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://www.youtube.com/watch?v=example"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Make sure the setup video is uploaded on YouTube and publicly
                accessible.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title & Equipment */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setup Video Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g., LEG EXTENSION SETUP" />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  This is the name of the setup video. Please name it with the
                  name of the exercise you are setting up for and enter the name
                  in all capital letters. Example: LEG EXTENSION SETUP. This
                  name will be displayed on the website with the video.
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  <li>
                    Must be a steady video on tripod or other item that makes
                    the video steady
                  </li>
                  <li>
                    Must be high resolution of at least 720p / iPhone 8 or
                    higher
                  </li>
                  <li>Must have setup and exercise video</li>
                  <li>Must have clear audio for the setup video</li>
                  <li>
                    Setup video must include what rack, upright dimensions (2x2,
                    2x3, 3x3, etc.), pin size
                  </li>
                </ul>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="equipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={equipments.map((equipment) => ({
                      value: equipment.id,
                      label: equipment.name,
                    }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select equipment"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Body Part & Height */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bodyPart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Part *</FormLabel>
                <FormControl>
                  <Select
                    value={(field.value || [])[0] || ""}
                    onValueChange={(value) => field.onChange([value])}
                  >
                    <SelectTrigger>
                      <span className="text-red-500">*</span>
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyParts.map((bodyPart) => (
                        <SelectItem key={bodyPart.id} value={bodyPart.id}>
                          {bodyPart.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Height</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Height in inches" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pump by Numbers */}
        <div className="space-y-4">
          <p className="font-semibold">
            Enter the specific Pump-by-Numbers color and number for each
            attachment:
          </p>
          <hr className="my-6" />
          <h2 className="text-2xl font-semibold">Pump-by-Numbers</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pumpColors.map((pump) => (
              <FormField
                key={pump.key}
                control={form.control}
                name={pump.key as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{pump.label}</FormLabel>
                    <Image
                      src={pump.img}
                      alt={pump.label}
                      width={300}
                      height={200}
                      className="w-full rounded border object-cover"
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value || "")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Not Used" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Used">Not Used</SelectItem>
                        {pumpNumbers.map((num) => (
                          <SelectItem key={num} value={num}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {pump.desc}
                    </p>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          {/* Rack */}
          <FormField
            control={form.control}
            name="rack"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel>Rack</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={racks.map((rack) => ({
                      value: rack.id,
                      label: rack.name,
                    }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select racks"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Isolator Hole */}
          <FormField
            control={form.control}
            name="isolatorHole"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  For ISOLATOR videos: How many holes high is the carriage
                  attached?
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Count from the bottom of the upright" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not Used">Not Used</SelectItem>
                      {pumpNumbers.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Count from the bottom up to where the ISOLATOR carriage pin is
                  inserted.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-3 py-4">
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full cursor-pointer md:w-auto"
          >
            {isUploading ? "Submitting..." : "Submit Setup Video"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
