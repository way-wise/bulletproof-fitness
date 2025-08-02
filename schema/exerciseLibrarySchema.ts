import { mixed, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: mixed().required("Video file is required"),
  equipment: string().optional().nullable(),
  bodyPart: string().optional().nullable(),
  height: string().optional().nullable(),
  rack: string().optional().nullable(),
  userId: string().required("User ID is required"),
});

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().required("Video file is required"),
  equipment: string().optional().nullable(),
  bodyPart: string().optional().nullable(),
  height: string().optional().nullable(),
  rack: string().optional().nullable(),
  userId: string().required("User ID is required"),
});
