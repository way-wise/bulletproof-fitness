import type { PaginationQuery } from "@/schema/paginationSchema";

// Extract pagination queries
export function getPaginationQuery(query: PaginationQuery) {
  const take = query.limit ?? 10;
  const skip = ((query.page ?? 1) - 1) * take;

  return {
    skip,
    take,
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  };
}
