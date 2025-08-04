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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useSession } from "@/lib/auth-client";
import useSWR from "swr";
import { MultiSelect } from "@/components/ui/multi-select";
import { X } from "lucide-react";

const formSchema = z.object({
  video: z.string().min(1, "Video is required"),
  title: z.string().min(1, "Video title is required"),
  equipments: z.array(z.string()).min(1, "Please select equipment"),
  bodyPart: z.array(z.string()).min(1, "Please select a body part"),
  rack: z.array(z.string()).min(1, "Please select a rack"),
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
  const [fileResource, setFileResource] = useState<
    CloudinaryUploadWidgetInfo | undefined | string
  >(undefined);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

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
      yellow: data.yellow,
      green: data.green,
      blue: data.blue,
      red: data.red,
      purple: data.purple,
      orange: data.orange,
      isolatorHole: data.isolatorHole,
    };

    // Send to video upload API
    const response = await fetch("/api/exercise-setup", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload video");
    }

    // Reset form
    setFileResource(undefined);
    form.reset();
  };

  const pumpColors = [
    {
      key: "yellow",
      label: "Yellow",
      img: "/assets/seat-apd-pbn-1.webp",
      desc: "Set on the circle cam",
      numbers: 24,
    },
    {
      key: "green",
      label: "Green",
      img: "/assets/lever-arm-pbn-2.webp",
      desc: "Set on the circle cam",
      numbers: 24,
    },
    {
      key: "blue",
      label: "Blue",
      img: "/assets/lever-arm-pbn-1-1.webp",
      desc: "Attachment lever arm",
      numbers: 14,
    },
    {
      key: "red",
      label: "Red",
      img: "/assets/weight-arm-lever-arm-png-1.webp",
      desc: "ISOLATOR lever arm hole position",
      numbers: 11,
    },
    {
      key: "purple",
      label: "Purple",
      img: "/assets/lla-cam-pbn.png",
      desc: "Long Lever Arm circle cam",
      numbers: 24,
    },
    {
      key: "orange",
      label: "Orange",
      img: "/assets/lla-arm-pbn.png",
      desc: "Long Lever Arm hole position",
      numbers: 29,
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
                uploadPreset="exercise-setup"
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
              <FormMessage>{form.formState.errors.video?.message}</FormMessage>
            </>
          )}
        </div>

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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Body Part */}
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
                      {Array.from(
                        { length: pump.numbers },
                        (_, i) => i + 1,
                      ).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
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
                  <Input type="number" min={0} {...field} />
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
