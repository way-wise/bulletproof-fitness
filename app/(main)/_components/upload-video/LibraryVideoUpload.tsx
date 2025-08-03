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
import useSWR from "swr";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  CldUploadWidget,
  CldVideoPlayer,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { X } from "lucide-react";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const formSchema = z.object({
  video: z
    .any()
    .refine((file) => file, {
      message: "Video is required",
    })
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: "Video must not exceed 1GB",
    }),
  title: z.string().min(1, "Video title is required"),
  equipments: z.array(z.string()).min(1, "Please select equipment"),
  bodyPart: z.string().min(1, "Please select a body part"),
  height: z.string().min(1, "Please enter your height"),
  rack: z.string().min(1, "Please select a rack"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LibraryVideoUpload() {
  const [fileResource, setFileResource] = useState<
    CloudinaryUploadWidgetInfo | undefined | string
  >(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // Get equipments
  const equipmentsUrl = `/api/equipments/all`;
  const {
    data: equipments,
    error: equipmentsError,
    isValidating: equipmentsIsValidating,
  } = useSWR(equipmentsUrl);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!fileResource) {
        form.setError("video", { message: "Please upload a video" });
        return;
      }

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
      formData.append("equipments", JSON.stringify(data.equipments));
      formData.append("bodyPart", data.bodyPart);
      formData.append("height", data.height);
      formData.append("rack", data.rack);
      formData.append("video", fileResource?.secure_url || "");

      // Send to video upload API
      const response = await fetch("/api/exercise-library", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }

      const result = await response.json();

      // Reset form
      setFileResource(undefined);
      form.reset();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to upload video",
      });
    } finally {
      setIsUploading(false);
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

        <div>
          <FormLabel className="mb-2 block">Video Upload *</FormLabel>
          {fileResource ? (
            <div className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-center text-sm text-muted-foreground">
              <video
                src={fileResource?.secure_url || ""}
                className="h-[270px] w-full"
                controls
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={async () => {
                  setFileResource(undefined);
                  form.setValue("video", undefined);
                  await fetch(`/api/sign-upload/${fileResource?.public_id}`, {
                    method: "DELETE",
                  });
                }}
                className="absolute top-2 right-2"
              >
                <X />
              </Button>
            </div>
          ) : (
            <>
              <CldUploadWidget
                signatureEndpoint="/api/sign-upload"
                options={{
                  sources: ["local"],
                  maxFiles: 1,
                  multiple: false,
                  maxFileSize: 1024 * 1024 * 1024,
                  resourceType: "video",
                  theme: "white",
                }}
                uploadPreset="exercise-library"
                onSuccess={(result, { widget }) => {
                  setFileResource(result?.info);
                  widget.close();
                }}
                onQueuesEnd={(result, { widget }) => {
                  widget.close();
                }}
              >
                {({ open }) => {
                  return (
                    <button
                      onClick={() => open()}
                      className="my-2 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-center text-sm text-muted-foreground"
                    >
                      Video Upload
                    </button>
                  );
                }}
              </CldUploadWidget>
              <FormMessage>{form.formState.errors.video?.message}</FormMessage>
            </>
          )}
        </div>

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
            name="equipments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipments </FormLabel>
                <MultiSelect
                  options={
                    equipments?.map((equipment: any) => ({
                      value: equipment.id,
                      label: equipment.name,
                    })) || []
                  }
                  selected={(field.value || []) as string[]}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select Equipments"
                  className="w-full"
                />
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
