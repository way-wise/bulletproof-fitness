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

const normalizeToArray = (val: unknown) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim() !== "") return [val];
  return [];
};

export const exerciseLibraryZapierSchema = object({
  title: string().required("Title is required"),
  embedUrl: string().url("Invalid embed URL").required("Embed URL is required"),
  playUrl: string().url("Invalid play URL").required("Play URL is required"),
  equipments: array().of(string()).transform(normalizeToArray),
  bodyParts: array().of(string()).transform(normalizeToArray),
  height: string().transform((value) => Number(value)),
  racks: array().of(string()).transform(normalizeToArray),
  userId: string().required("User id is required"),
  publishedAt: string().optional().nullable(),
});

export type exerciseLibraryZapierSchemaType = InferType<
  typeof exerciseLibraryZapierSchema
>;
