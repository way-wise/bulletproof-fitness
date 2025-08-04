import { array, InferType, number, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User id is required"),
});

export type exerciseLibrarySchemaType = InferType<typeof exerciseLibrarySchema>;

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: number()
    .required("Height is required")
    .min(0, "Height must be a positive number"),
  rack: array().of(string()).default([]),
  userId: string().required("User id is required"),
});

export const exerciseLibraryZapierSchema = object({
  youtube: string().required("Details of youtube video is required"),
  embedUrl: string().url("Invalid embed URL").required("Embed URL is required"),
  playUrl: string().url("Invalid play URL").optional(),
  publishedAt: string().optional(),
});

export type exerciseLibraryZapierSchemaType = InferType<
  typeof exerciseLibraryZapierSchema
>;
