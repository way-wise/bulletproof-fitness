import { InferType, object, string, boolean, mixed } from "yup";

// User Schema
export const userSchema = object({
  id: string(),
  name: string(),
  email: string().email(),
  emailVerified: boolean().nullable(),
  image: string().nullable(),
  banned: boolean().nullable(),
  role: string().nullable(),
  banReason: string().nullable(),
  banExpires: mixed(),
  createdAt: mixed(),
  updatedAt: mixed(),
});

export type User = InferType<typeof userSchema>;
