import { array, InferType, number, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string().required()).default([]),
  bodyPart: array().of(string().required()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string().required()).default([]),
  userId: string().required("User id is required"),
});

export type exerciseLibrarySchemaType = InferType<typeof exerciseLibrarySchema>;

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string().required()).default([]),
  bodyPart: array().of(string().required()).default([]),
  height: number()
    .required("Height is required")
    .min(0, "Height must be a positive number"),
  rack: array().of(string().required()).default([]),
  userId: string().required("User id is required"),
});

export const exerciseLibraryZapierSchema = object({
  title: string().required("Title is required"),
  equipments: string().required(),
  bodyPart: string().required(),
  racks: string().required(),
  videoUrl: string().url("Invalid video URL").required("Video URL is required"),
  playUrl: string().url("Invalid play URL").required(),
  userId: string().required("User ID is required"),
  height: string().required("Height is required"),
  publishedAt: string().required(),
  youtubeEmbedUrl: string().url("Invalid embed URL").required(),
  youtubePlayUrl: string().url("Invalid play URL").required(),
});

export type exerciseLibraryZapierSchemaType = InferType<
  typeof exerciseLibraryZapierSchema
>;
