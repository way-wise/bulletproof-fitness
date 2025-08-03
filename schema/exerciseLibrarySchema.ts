import { array, InferType, mixed, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: mixed<File>()
    .required("Video file is required")
    .test("fileSize", "Video must not exceed 1GB", (value) => {
      if (!value) return false;
      return value.size <= 1024 * 1024 * 1024;
    }),
  equipments: array().of(string()).optional().default([]),
  bodyPart: array().of(string()).optional().default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).optional().default([]),
  userId: string().required("User ID is required"),
});

export type exerciseLibrarySchemaType = InferType<typeof exerciseLibrarySchema>;

export const exerciseLibrarySchemaAdmin = object({
  title: string().required("Title is required"),
  videoUrl: string().required("Video URL is required"),
  equipments: array().of(string()).default([]),
  bodyPart: array().of(string()).default([]),
  height: string().optional().nullable(),
  rack: array().of(string()).default([]),
  userId: string().required("User ID is required"),
});
