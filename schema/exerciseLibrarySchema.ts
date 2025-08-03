import { array, InferType, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
});

export type exerciseLibrarySchemaType = InferType<typeof exerciseLibrarySchema>;

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().url("Invalid video URL").required("Video URL is required"),
  equipments: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
});
