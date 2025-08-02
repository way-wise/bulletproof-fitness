import { array, object, string } from "yup";

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
