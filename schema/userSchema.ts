import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  banned: z.boolean().nullable(),
  role: z.string().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.union([z.date(), z.string(), z.number(), z.null()]),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type User = z.infer<typeof userSchema>;
