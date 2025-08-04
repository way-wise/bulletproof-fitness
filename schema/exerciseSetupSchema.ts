import { array, InferType, number, object, string } from "yup";

export const exerciseSetupSchema = object({
  title: string().required("Title is required"),
  videoUrl: string().required("Video URL is required"),
  equipment: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
  // Pump by numbers fields
  isolatorHole: string().optional().nullable(),
  yellow: string().optional().nullable(),
  green: string().optional().nullable(),
  blue: string().optional().nullable(),
  red: string().optional().nullable(),
  purple: string().optional().nullable(),
  orange: string().optional().nullable(),
});

export const exerciseSetupSchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().required("Video URL is required"),
  equipment: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: number()
    .required("Height is required")
    .min(0, "Height must be a positive number"),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
  // Pump by numbers fields
  isolatorHole: string().optional().nullable(),
  yellow: string().optional().nullable(),
  green: string().optional().nullable(),
  blue: string().optional().nullable(),
  red: string().optional().nullable(),
  purple: string().optional().nullable(),
  orange: string().optional().nullable(),
});

export const exerciseSetupZapierSchema = object({
  youtube: string().required("Details of youtube video is required"),
  embedUrl: string().url("Invalid embed URL").required("Embed URL is required"),
  playUrl: string().url("Invalid play URL").optional(),
  publishedAt: string().optional(),
});

export type exerciseSetupZapierSchemaType = InferType<
  typeof exerciseSetupZapierSchema
>;
