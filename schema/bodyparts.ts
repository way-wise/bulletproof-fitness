import { object, string } from "yup";

// Body Part Schema
export const bodyPartSchema = object({
  name: string().required("Name is required"),
});
