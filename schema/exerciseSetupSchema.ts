import { array, InferType, number, object, string } from "yup";

export const exerciseSetupSchema = object({
  title: string().required("Title is required"),
  video: string().required("Video URL is required"),
  equipments: array().of(string().required()).default([]),
  bodyPart: array().of(string().required()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string().required()).default([]),
  userId: string().required("User ID is required"),
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
  isolatorHole: string().optional().nullable(),
  yellow: string().optional().nullable(),
  green: string().optional().nullable(),
  blue: string().optional().nullable(),
  red: string().optional().nullable(),
  purple: string().optional().nullable(),
  orange: string().optional().nullable(),
});

export const exerciseSetupZapierSchema = object({
  title: string().required("Title is required"),
  equipments: string().required(),
  bodyPart: string().required(),
  racks: string().required(),
  videoUrl: string().url("Invalid video URL").required("Video URL is required"),
  playUrl: string().url("Invalid play URL").required(),
  publishedAt: string().required("Published at is required"),
  youtubeEmbedUrl: string().url("Invalid embed URL").required(),
  youtubePlayUrl: string().url("Invalid play URL").required(),
  height: string().required("Height is required"),
  userId: string().required("User ID is required"),
  isolatorHole: string().optional().nullable(),
  yellow: string().optional().nullable(),
  green: string().optional().nullable(),
  blue: string().optional().nullable(),
  red: string().optional().nullable(),
  purple: string().optional().nullable(),
  orange: string().optional().nullable(),
});

export type exerciseSetupZapierSchemaType = InferType<
  typeof exerciseSetupZapierSchema
>;
