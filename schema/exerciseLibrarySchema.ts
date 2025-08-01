import { mixed, object, string } from "yup";

// Exercise Library Schema for form validation
export const exerciseLibrarySchema = object({
  title: string().required("Title is required"),
  video: mixed().required("Video file is required"),
  equipment: string().required("Equipment is required"),
  bodyPart: string().required("Body part is required"),
  height: string().required("Height is required"),
  rack: string().required("Rack is required"),
  userId: string().required("User ID is required"),
});
