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
import { useEffect, useState } from "react";
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

interface UpdateSetupVideoProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
  mutateUrl: string;
}

export const UpdateSetupVideo = ({
  isOpen,
  onClose,
  videoId,
  mutateUrl,
}: UpdateSetupVideoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
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

  const fetchVideoData = async () => {
    if (!videoId) return;

    try {
      setIsFetchingData(true);
      const response = await fetch(`/api/exercise-setup/dashboard/${videoId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }

      const result = await response.json();
      const videoData = result.data;

      // Transform the data to match form structure
      const formData = {
        videoUrl: videoData.videoUrl || "",
        title: videoData.title || "",
        equipment:
          videoData.ExSetupEquipment?.map(
            (item: { equipmentId: string }) => item.equipmentId,
          ) || [],
        bodyPart:
          videoData.ExSetupBodyPart?.map(
            (item: { bodyPartId: string }) => item.bodyPartId,
          ) || [],
        height: videoData.height || "",
        rack:
          videoData.ExSetupRak?.map(
            (item: { rackId: string }) => item.rackId,
          ) || [],
        isolatorHole: videoData.isolatorHole || "",
        yellow: videoData.yellow || "",
        green: videoData.green || "",
        blue: videoData.blue || "",
        red: videoData.red || "",
        purple: videoData.purple || "",
        orange: videoData.orange || "",
      };
      console.log(formData);
      form.reset(formData);
    } catch (error) {
      toast.error("Failed to fetch video data");
      console.error("Error fetching video data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  // Fetch video data when modal opens
  useEffect(() => {
    if (isOpen && videoId) {
      fetchVideoData();
    }
  }, [isOpen, videoId]);

  const onSubmit = async (data: FormValues) => {
    if (!videoId) return;

    try {
      setIsLoading(true);

      const submitData = {
        ...data,
        equipment: data.equipment.length > 0 ? data.equipment : [],
        bodyPart: data.bodyPart.length > 0 ? data.bodyPart : [],
        rack: data.rack.length > 0 ? data.rack : [],
      };

      const response = await fetch(`/api/exercise-setup/dashboard/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update video data");
      }

      toast.success("Setup video updated successfully!");
      mutate(mutateUrl);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/75" onClick={onClose} />
      <div className="relative w-full max-w-6xl rounded-lg bg-card shadow-xl">
        <div className="flex justify-between gap-3 border-b p-5">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">Update Exercise Setup Video</p>
          </div>
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>

        {isFetchingData ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading video data...</p>
            </div>
          </div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                        Make sure the setup video is uploaded on YouTube and
                        publicly accessible.
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
                          <Input
                            {...field}
                            placeholder="E.g., LEG EXTENSION SETUP"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          This is the name of the setup video. Please name it
                          with the name of the exercise you are setting up for
                          and enter the name in all capital letters. Example:
                          LEG EXTENSION SETUP.
                        </p>
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
                          <Input {...field} placeholder="Height in inches" />
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
                                <SelectItem value="Not Used">
                                  Not Used
                                </SelectItem>
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
                          For ISOLATOR videos: How many holes high is the
                          carriage attached?
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
                          Count from the bottom up to where the ISOLATOR
                          carriage pin is inserted.
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
                    disabled={isLoading}
                    className="w-full cursor-pointer md:w-auto"
                  >
                    {isLoading ? "Updating..." : "Update Setup Video"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};
