import { object, string } from "yup";

// Equipment Schema
export const equipmentSchema = object({
  name: string().required("Name is required"),
});
