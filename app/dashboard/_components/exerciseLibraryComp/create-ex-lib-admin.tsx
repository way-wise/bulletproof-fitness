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
import { useBodyParts } from "@/hooks/useBodyParts";
import { useEquipments } from "@/hooks/useEquipments";
import { useRacks } from "@/hooks/useRacks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import * as z from "zod";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL"),
  title: z.string().min(1, "Video title is required"),
  equipment: z.array(z.string()),
  bodyPart: z.array(z.string()),
  height: z.string().optional(),
  rack: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export default function LibraryVideoUpload({
  setAddExerciseModalOpen,
  mutateUrl,
}: {
  setAddExerciseModalOpen: (value: boolean) => void;
  mutateUrl: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const {
    bodyParts,
    isLoading: bodyPartsLoading,
    error: bodyPartsError,
  } = useBodyParts();
  const { racks, isLoading: racksLoading, error: racksError } = useRacks();
  const {
    equipments,
    isLoading: equipmentsLoading,
    error: equipmentsError,
  } = useEquipments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
      equipment: [],
      bodyPart: [],
      height: "",
      rack: [],
    },
  });

  // Handle loading states
  const isLoading = bodyPartsLoading || racksLoading || equipmentsLoading;

  // Handle errors
  if (bodyPartsError || racksError || equipmentsError) {
    console.error("Error loading data:", {
      bodyPartsError,
      racksError,
      equipmentsError,
    });
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      // Send arrays directly to backend
      const submitData = {
        ...data,
        equipments: data.equipment.length > 0 ? data.equipment : [],
        bodyPart: data.bodyPart.length > 0 ? data.bodyPart : [],
        rack: data.rack.length > 0 ? data.rack : [],
      };

      const response = await fetch("/api/exercise-library/dashboard", {
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
      toast.success("Video submitted successfully!");
      form.reset();

      // Revalidate the exercise library data to show the new entry
      mutate(mutateUrl);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsUploading(false);
      setAddExerciseModalOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Video URL */}
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Video Link *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://www.youtube.com/watch?v=example"
                  disabled={isUploading}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Make sure the video is uploaded on YouTube and publicly
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
                <FormLabel>Video Title *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="E.g., Leg Extension"
                    disabled={isUploading}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Name it with the exercise being performed.
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
                    placeholder={isLoading ? "Loading..." : "Select equipment"}
                    disabled={isLoading || isUploading}
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
                <FormLabel>Body Part</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={bodyParts.map((bodyPart) => ({
                      value: bodyPart.id,
                      label: bodyPart.name,
                    }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={isLoading ? "Loading..." : "Select body parts"}
                    disabled={isLoading || isUploading}
                  />
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
                  <Input
                    {...field}
                    placeholder="Height in inches"
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rack */}
        <FormField
          control={form.control}
          name="rack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rack</FormLabel>
              <FormControl>
                <MultiSelect
                  options={racks.map((rack) => ({
                    value: rack.id,
                    label: rack.name,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder={isLoading ? "Loading..." : "Select racks"}
                  disabled={isLoading || isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-center gap-3 py-4">
          <Button
            type="submit"
            disabled={isUploading || isLoading}
            className="w-full cursor-pointer md:w-auto"
          >
            {isUploading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
