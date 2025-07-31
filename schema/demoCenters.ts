import { array, object, string } from "yup";

// Demo Center Schema
export const demoCenterSchema = object({
  buildingType: string().required("Building type is required"),
  name: string().required("Name is required"),
  address: string().required("Address is required"),
  contact: string().required("Contact is required"),
  cityZip: string().required("City/Zip is required"),
  image: string().required("Image is required"),
  equipment: string().required("Equipment is required"),
  availability: string().optional(),
  bio: string().required("Bio is required"),
  // Business specific fields
  weekdays: array().of(string()).optional(),
  weekends: array().of(string()).optional(),
  weekdayOpen: string().optional(),
  weekdayClose: string().optional(),
  weekendOpen: string().optional(),
  weekendClose: string().optional(),
});
