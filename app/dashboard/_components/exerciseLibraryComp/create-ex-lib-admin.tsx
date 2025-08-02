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
import { useBodyParts } from "@/hooks/useBodyParts";
import { useEquipments } from "@/hooks/useEquipments";

import { useRacks } from "@/hooks/useRacks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  videoUrl: z.string().url("Please enter a valid YouTube URL"),
  title: z.string().min(1, "Video title is required"),
  equipment: z.string().optional().nullable(),
  bodyPart: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  rack: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LibraryVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { bodyParts } = useBodyParts();
  const { racks } = useRacks();
  const { equipments } = useEquipments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      const response = await fetch("/api/exercise-library/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit video data");
      }

      const result = await response.json();
      toast.success("Video submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsUploading(false);
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
                  <Input {...field} placeholder="E.g., Leg Extension" />
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
                <FormLabel>Equipment *</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.name}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bodyParts.map((bodyPart) => (
                      <SelectItem key={bodyPart.id} value={bodyPart.name}>
                        {bodyPart.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Height *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Height in inches" />
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
              <FormLabel>Rack *</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rack" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {racks.map((rack) => (
                    <SelectItem key={rack.id} value={rack.name}>
                      {rack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-center gap-3 py-4">
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full cursor-pointer md:w-auto"
          >
            {isUploading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
