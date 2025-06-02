import type { PaginationQuery } from "@/schema/paginationSchema";
import { getPaginationQuery } from "@/app/api/lib/pagination";
import prisma from "@/lib/prisma";

export const userService = {
  getUsers: async (query: PaginationQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);

    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.users.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
      },
    };
  },
};
