import { array, boolean, InferType, number, object, string } from "yup";

// Demo Center Schema
export const demoCenterSchema = object({
  buildingType: string().required("Building type is required"),
  name: string().required("Name is required"),
  address: string().optional(),
  contact: string().required("Contact is required"),
  cityZip: string().required("City/Zip is required"),
  image: string().required("Image is required"),
  equipment: array()
    .of(string().required("Equipment is required"))
    .default([])
    .required(),
  availability: string().optional(),
  bio: string().required("Bio is required"),
  // Business specific fields - make these optional since they're not always provided
  weekdays: array().of(string()).optional(),
  weekends: array().of(string()).optional(),
  weekdayOpen: string().optional(),
  weekdayClose: string().optional(),
  weekendOpen: string().optional(),
  weekendClose: string().optional(),
  // New fields - make these optional with defaults
  isPublic: boolean().optional().default(false),
  blocked: boolean().optional().default(false),
  blockReason: string().optional(),
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
  equipments: string().optional(),
  page: number().integer().min(1).default(1),
  limit: number().integer().min(1).max(100).default(10),
});

export type DemoCenterQuery = InferType<typeof demoCenterQuerySchema>;
