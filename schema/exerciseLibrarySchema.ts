import { array, mixed, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: mixed().required("Video file is required"),
  equipment: array().of(string()).optional().default([]),
  bodyPart: array().of(string()).optional().default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).optional().default([]),
  userId: string().required("User ID is required"),
});

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().required("Video URL is required"),
  equipment: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
});
