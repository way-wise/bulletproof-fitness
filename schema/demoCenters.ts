import { array, boolean, InferType, number, object, string } from "yup";

// Demo Center Schema
export const demoCenterSchema = object({
  buildingType: string().required("Building type is required"),
  name: string().required("Name is required"),
  address: string().required("Address is required"),
  contact: string().required("Contact is required"),
  cityZip: string().required("City/Zip is required"),
  image: string().required("Image is required"),
  equipment: string().required("Equipment is required"),
  availability: string().required("Availability is required"),
  bio: string().required("Bio is required"),
  // Business specific fields
  weekdays: array().of(string()).required("Weekdays are required"),
  weekends: array().of(string()).required("Weekends are required"),
  weekdayOpen: string().required("Weekday open time is required"),
  weekdayClose: string().required("Weekday close time is required"),
  weekendOpen: string().required("Weekend open time is required"),
  weekendClose: string().required("Weekend close time is required"),
  // New fields
  isPublic: boolean().required("Public status is required"),
  blocked: boolean().required("Blocked status is required"),
  blockReason: string().required("Block reason is required"),
});

// Schema for updating demo center status
export const updateDemoCenterStatusSchema = object({
  isPublic: boolean().optional(),
  blocked: boolean().optional(),
  blockReason: string().optional(),
});

// Schema for blocking/unblocking demo center
export const blockDemoCenterSchema = object({
  demoCenterId: string().required("Demo center ID is required"),
  blockReason: string().required("Block reason is required"),
});

export const unblockDemoCenterSchema = object({
  demoCenterId: string().required("Demo center ID is required"),
});

// Demo Center Query Schema
export const demoCenterQuerySchema = object({
  location: string().optional(),
  range: number().optional(),
  buildingType: string().optional(),
  equipments: array().of(string()).optional(),
  page: number().integer().min(1).default(1),
  limit: number().integer().min(1).max(100).default(10),
});

export type DemoCenterQuery = InferType<typeof demoCenterQuerySchema>;
