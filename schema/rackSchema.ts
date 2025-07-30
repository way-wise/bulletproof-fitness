import { object, string } from "yup";

// Rack Schema
export const rackSchema = object({
  name: string().required("Name is required"),
});
