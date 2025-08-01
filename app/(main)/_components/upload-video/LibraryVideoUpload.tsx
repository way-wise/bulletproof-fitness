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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const formSchema = z.object({
  video: z.any().refine((file) => file && file.size <= MAX_FILE_SIZE, {
    message: "Video must not exceed 1GB",
  }),
  title: z.string().min(1, "Video title is required"),
  equipment: z.string().min(1, "Please select equipment"),
  bodyPart: z.string().min(1, "Please select a body part"),
  height: z.string().min(1, "Please enter your height"),
  rack: z.string().min(1, "Please select a rack"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LibraryVideoUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      setUploadProgress("Uploading video to Google Drive...");

      // Get the video file from the form
      const videoFile = form.getValues("video") as File;
      if (!videoFile) {
        form.setError("video", { message: "Please select a video file" });
        return;
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", data.title);
      formData.append("equipment", data.equipment);
      formData.append("bodyPart", data.bodyPart);
      formData.append("height", data.height);
      formData.append("rack", data.rack);

      // Send to Google Drive upload API
      const response = await fetch("/api/google-drive-upload", {
        method: "POST",
        body: formData, // Don't set Content-Type header, let browser set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload video");
      }

      const result = await response.json();
      console.log("Video uploaded successfully:", result);

      // Reset form
      form.reset();
      setFileName(null);
      setUploadProgress(
        "Video uploaded to Google Drive successfully! It will be automatically uploaded to YouTube via Zapier.",
      );

      // Clear success message after 5 seconds
      setTimeout(() => {
        setUploadProgress("");
      }, 5000);
    } catch (error) {
      console.error("Error uploading video:", error);
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to upload video",
      });
    } finally {
      setIsUploading(false);
    }
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-6xl space-y-8 rounded-lg border bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">
          Upload Exercise Library Video
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

        {/* Title & Equipment */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g., Leg Extension" />
                </FormControl>
                <p className="mt-2 text-xs text-muted-foreground">
                  Name it with the exercise being performed. Example: Leg
                  Extension
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-muted-foreground">
                  <li>
                    <p>
                      Must be a steady video on tripod or other item that makes
                      the video steady
                    </p>
                  </li>
                  <li>
                    <p>
                      Must be high resolution of at least 720p / iPhone 8 or
                      higher
                    </p>
                  </li>
                  <li>
                    <p>Must have setup and exercise video</p>
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
                <p className="mt-2 text-xs text-muted-foreground">
                  Select the equipment used in your video.You can select
                  multiple pieces of equipment if multiple pieces are used.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Body Part & Height */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <p className="mt-2 text-xs text-muted-foreground">
                  This is your height in inches.
                </p>
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
                  <SelectItem value="Bells of Steel Hydra Series">
                    Bells of Steel Hydra Series with 3x3 uprights & 5/8 holes
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

        {/* Error/Success Messages */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            {form.formState.errors.root.message}
          </div>
        )}

        {uploadProgress && !form.formState.errors.root && (
          <div className="rounded-md bg-green-50 p-4 text-green-700">
            {uploadProgress}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full md:w-40"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
