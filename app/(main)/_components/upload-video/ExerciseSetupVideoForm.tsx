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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

// Helper for pump numbers
const pumpNumbers = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

const formSchema = z.object({
  video: z.any().refine((file) => file && file.size <= MAX_FILE_SIZE, {
    message: "Video must not exceed 1GB",
  }),
  title: z.string().min(1, "Video title is required"),
  equipment: z.string().min(1, "Please select equipment"),
  bodyPart: z.string().min(1, "Please select a body part"),
  rack: z.string().min(1, "Please select a rack"),
  height: z.string().min(1, "Please enter your height"),
  isolatorHole: z.string().optional(),
  yellow: z.string().optional(),
  green: z.string().optional(),
  blue: z.string().optional(),
  red: z.string().optional(),
  purple: z.string().optional(),
  orange: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExerciseSetupVideoForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, video: fileName });
    // TODO: API call
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= MAX_FILE_SIZE) {
      form.setValue("video", file);
      setFileName(file.name);
    } else {
      form.setError("video", { message: "File size exceeds 1GB" });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl space-y-10 rounded-lg border bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">
          Upload Exercise Setup Video
        </h1>

        {/* Video Upload */}
        <FormField
          control={form.control}
          name="video"
          render={() => (
            <FormItem>
              <FormLabel>Video Upload *</FormLabel>
              <div
                className={cn(
                  "flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-center text-sm text-muted-foreground",
                  fileName && "border-primary",
                )}
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                {fileName ? (
                  <p className="text-primary">{fileName}</p>
                ) : (
                  <p>Click or drag a file to this area to upload</p>
                )}
                <p className="mt-2 text-xs">Video upload cannot exceed 1GB.</p>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title, Equipment, Body Part */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g., LEG EXTENSION" />
                </FormControl>
                <p className="mt-1 text-xs text-muted-foreground">
                  This is the name of the video. For setup videos please name it
                  with the name of the exercise you are setting up for and enter
                  the name in all capital letters. Example: LEG EXTENSION. This
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
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Adjustable Handles">
                        Adjustable Handles
                      </SelectItem>
                      <SelectItem value="Dumbbells">Dumbbells</SelectItem>
                      <SelectItem value="Kettlebells">Kettlebells</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select the equipment used in your video. You can select
                    multiple pieces of equipment if multiple pieces are used.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bodyPart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Part *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select body part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Abs">Abs</SelectItem>
                      <SelectItem value="Arms">Arms</SelectItem>
                      <SelectItem value="Legs">Legs</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Please select the body part that this video focuses on.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pump by Numbers */}

        <p className="tex mb-4 font-semibold">
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
                    defaultValue={field.value}
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

        {/* Rack */}
        <FormField
          control={form.control}
          name="rack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rack *</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rack" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Bells of Steel Hydra Series">
                    Bells of Steel Hydra Series (3x3 uprights & 5/8 holes)
                  </SelectItem>
                  <SelectItem value="Rogue Monster Lite">
                    Rogue Monster Lite
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Height & Isolator */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Height *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Height in inches" />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Your height in inches.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isolatorHole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  For ISOLATOR videos: How many holes high is the carriage
                  attached?
                </FormLabel>
                <FormControl>
                  {/* <Input
                    {...field}
                    placeholder="Count from the bottom of the upright"
                  /> */}
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

        <div className="flex justify-center">
          <Button type="submit" className="w-full md:w-40">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
