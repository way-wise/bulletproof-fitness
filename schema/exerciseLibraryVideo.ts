import * as yup from "yup";

// Exercise Library Video Upload Schema
export const exerciseLibraryVideoSchema = yup.object({
  title: yup
    .string()
    .required("Video title is required")
    .min(1, "Video title must not be empty"),
  videoUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Video URL is required"),
  equipment: yup
    .string()
    .required("Equipment is required")
    .min(1, "Please select equipment"),
  bodyPart: yup
    .string()
    .required("Body part is required")
    .min(1, "Please select a body part"),
  height: yup
    .string()
    .required("Height is required")
    .min(1, "Please enter your height"),
  rack: yup
    .string()
    .required("Rack is required")
    .min(1, "Please select a rack"),
  userId: yup.string().required("User ID is required"),
});

// Update Exercise Library Video Schema
export const updateExerciseLibraryVideoSchema = yup.object({
  title: yup.string().optional(),
  videoUrl: yup.string().url("Must be a valid URL").optional(),
  equipment: yup.string().optional(),
  bodyPart: yup.string().optional(),
  height: yup.string().optional(),
  rack: yup.string().optional(),
});

// Search Exercise Library Videos Schema
export const searchExerciseLibraryVideosSchema = yup.object({
  query: yup.string().required("Search query is required"),
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
});
