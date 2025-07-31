import { InferType, number, object, string } from "yup";

export const paginationQuerySchema = object({
  page: number().integer().min(1).default(1),
  limit: number().integer().min(1).max(100).default(10),
  search: string().optional(),
});

export type PaginationQuery = InferType<typeof paginationQuerySchema>;
