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
import { useSession } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import * as z from "zod";

const formSchema = z.object({
  video: z.string(),
  title: z.string().min(1, "Video title is required"),
  equipments: z.array(z.string()).min(1, "equipment is required"),
  bodyPart: z.array(z.string()).min(1, "body part is required"),
  height: z.string().min(1, "height is required"),
  rack: z.array(z.string()).min(1, "rack is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LibraryVideoUpload() {
  const [fileResource, setFileResource] = useState<
    CloudinaryUploadWidgetInfo | undefined | string
  >(undefined);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const { data: session } = useSession();

  // Get equipments
  const equipmentsUrl = `/api/equipments/all`;
  const {
    data: equipments,
    error: equipmentsError,
    isValidating: equipmentsIsValidating,
  } = useSWR(equipmentsUrl);

  // Get body parts
  const bodyPartsUrl = `/api/body-parts`;
  const {
    data: bodyParts,
    error: bodyPartsError,
    isValidating: bodyPartsIsValidating,
  } = useSWR(bodyPartsUrl);

  // Get racks
  const racksUrl = `/api/racks`;
  const {
    data: racks,
    error: racksError,
    isValidating: racksIsValidating,
  } = useSWR(racksUrl);

  const onSubmit = async (data: FormValues) => {
    if (!fileResource) {
      form.setError("video", { message: "Please upload a video" });
      return;
    }

    const formData = {
      title: data.title,
      equipments: data.equipments,
      bodyPart: data.bodyPart,
      height: data.height,
      rack: data.rack,
      video: fileResource?.secure_url,
      userId: session?.user.id,
    };

    // Send to video upload API
    const response = await fetch("/api/exercise-library", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Video uploaded failed!");
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload video");
    }
    const result = await response.json();
    toast.success(
      result.message || "Video uploaded successfully, awaiting approval",
    );
    setTimeout(() => {
      router.push("/upload-video");
    }, 1500);

    // Reset form
    setFileResource(undefined);
    form.reset();
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
              {fileResource && typeof fileResource === "object" ? (
                <video
                  src={fileResource.secure_url}
                  className="h-[270px] w-full"
                  controls
                />
              ) : null}
              <Button
                size="icon"
                variant="secondary"
                onClick={async () => {
                  setFileResource(undefined);
                  form.setValue("video", "");
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
                  if (result?.info && typeof result.info !== "string") {
                    setFileResource(result.info);
                    form.setValue("video", result.info.secure_url);
                  } else {
                    console.error("Invalid file resource");
                  }
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
              <FormMessage />
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
          {/* Equipments */}
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
                {form.formState.errors.equipments && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.equipments.message ||
                      "Please select at least one equipment"}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Body Part */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bodyPart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Part *</FormLabel>
                <MultiSelect
                  options={
                    bodyParts?.data.map((bodyPart: any) => ({
                      value: bodyPart.id,
                      label: bodyPart.name,
                    })) || []
                  }
                  selected={(field.value || []) as string[]}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select Body Part"
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Height *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Height in inches"
                  />
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
              <MultiSelect
                options={
                  racks?.data.map((rack: any) => ({
                    value: rack.id,
                    label: rack.name,
                  })) || []
                }
                selected={(field.value || []) as string[]}
                onChange={(value) => field.onChange(value)}
                placeholder="Select Rack"
                className="w-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full cursor-pointer md:w-40"
            isLoading={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
