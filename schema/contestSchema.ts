import { object, string, boolean, date, array, number, InferType } from "yup";

// Contest card schema
export const contestCardSchema = object({
  id: string().optional(),
  title: string()
    .required("Card title is required")
    .max(200, "Title must be less than 200 characters"),
  description: string()
    .required("Card description is required"),
  backgroundColor: string()
    .required("Background color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color code"),
  order: number()
    .required("Order is required")
    .min(0, "Order must be 0 or greater"),
  cardType: string()
    .optional(),
});

// Contest section schema
export const contestSectionSchema = object({
  id: string().optional(),
  sectionType: string()
    .required("Section type is required")
    .oneOf([
      "hero", "main", "demo_center", "pump_numbers", "mission", 
      "why_matters", "getting_started", "your_mission", "prizes", 
      "how_to_win", "fair_transparent", "why_join", "timeline", "ready_to_join"
    ], "Invalid section type"),
  title: string()
    .optional()
    .max(300, "Title must be less than 300 characters"),
  subtitle: string()
    .optional()
    .max(500, "Subtitle must be less than 500 characters"),
  description: string()
    .optional(),
  ctaText: string()
    .optional()
    .max(100, "CTA text must be less than 100 characters"),
  ctaUrl: string()
    .optional(),
  order: number()
    .required("Order is required")
    .min(0, "Order must be 0 or greater"),
  isVisible: boolean()
    .default(true),
  cards: array(contestCardSchema)
    .optional()
    .default([]),
});

// Main contest schema
export const contestSchema = object({
  isActive: boolean()
    .default(true),
  startDate: date()
    .optional()
    .nullable(),
  endDate: date()
    .optional()
    .nullable()
    .when("startDate", (startDate, schema) => {
      if (startDate && startDate[0]) {
        return schema.min(startDate[0], "End date must be after start date");
      }
      return schema;
    }),
  sections: array(contestSectionSchema)
    .optional()
    .default([]),
});

export const updateContestSchema = contestSchema.partial();

export type ContestCardFormData = InferType<typeof contestCardSchema>;
export type ContestSectionFormData = InferType<typeof contestSectionSchema>;
export type ContestFormData = InferType<typeof contestSchema>;
export type UpdateContestFormData = InferType<typeof updateContestSchema>;