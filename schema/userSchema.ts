import { InferType, object, string, boolean, mixed } from "yup";

// User Schema
export const userSchema = object({
  id: string(),
  name: string().required(),
  email: string().email().required(),
  emailVerified: boolean().nullable(),
  image: string().nullable(),
  banned: boolean().nullable(),
  role: string().nullable().oneOf(["admin", "user"]),
  banReason: string().nullable(),
  banExpires: mixed().nullable(),
  createdAt: mixed(),
  updatedAt: mixed(),
});

export type User = InferType<typeof userSchema>;
