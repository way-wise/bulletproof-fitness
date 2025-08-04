import type { PaginationQuery } from "@/schema/paginationSchema";
import { getPaginationQuery } from "@/app/api/lib/pagination";
import prisma from "@/lib/prisma";
import { HTTPException } from "hono/http-exception";
import { getSession } from "@/lib/auth";

export const userService = {
  // Get all users
  getUsers: async (query: PaginationQuery) => {
    const session = await getSession();

    const { skip, take, page, limit } = getPaginationQuery(query);
    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        where: {
          NOT: {
            id: session?.user?.id,
          },
        },
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
  // Get user by id
  getUser: async (id: string) => {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        createdAt: true,
        banned: true,
        image: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    return user;
  },

  getUserRewards: async (id: string, query: PaginationQuery) => {
    const session = await getSession();
    if (!session) throw new HTTPException(401, { message: "Unauthorized" });

    const { skip, take, page, limit = 10 } = getPaginationQuery(query);

    const [user, total] = await prisma.$transaction([
      prisma.users.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          totalPoints: true,
          createdAt: true,
          banned: true,
          image: true,
          role: true,
          emailVerified: true,

          rewardPoints: {
            orderBy: { createdAt: "desc" },
            skip,
            take,
            select: {
              id: true,
              points: true,
              createdAt: true,
              description: true,
              type: true,
              isActive: true,
              name: true,
              updatedAt: true,
            },
          },
        },
      }),
      prisma.rewardPoints.count({
        where: { userId: id },
      }),
    ]);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return {
      user,
      data: {
        data: user.rewardPoints,
        meta: {
          page,
          limit,
          total,
        },
      },
    };
  },
};
