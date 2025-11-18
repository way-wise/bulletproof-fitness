import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { placeholderAttribute } from "../attributes/placeholder";
import { requiredAttribute } from "../attributes/required";

// Location data structure that will be saved
const locationSchema = z.object({
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  placeId: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  formattedAddress: z.string().optional(),
});

export const locationFieldEntity = createEntity({
  name: "locationField",
  attributes: [labelAttribute, placeholderAttribute, requiredAttribute],
  validate(value) {
    // Allow empty for optional fields, or validate location structure
    if (!value) return z.undefined().parse(value);
    return locationSchema.optional().parse(value);
  },
});
