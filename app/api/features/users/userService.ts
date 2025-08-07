import { getPaginationQuery } from "@/app/api/lib/pagination";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";

export const userService = {
  // Get all users
  getUsers: async (query: PaginationQuery) => {
    const session = await getSession();

    const whereFilter: any = {
      NOT: {
        id: session?.user?.id,
      },
    };

    if (query.search && query.search.trim()) {
      whereFilter.AND = [
        {
          OR: [
            {
              email: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        },
      ];
    }

    const { skip, take, page, limit } = getPaginationQuery(query);
    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        where: whereFilter,
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

  // Get current user profile
  getCurrentUser: async () => {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        createdAt: true,
        updatedAt: true,
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

  // Update current user profile
  updateCurrentUser: async (data: {
    name?: string;
    email?: string;
    image?: string;
  }) => {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.image && { image: data.image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        createdAt: true,
        updatedAt: true,
        banned: true,
        image: true,
        role: true,
        emailVerified: true,
      },
    });

    return updatedUser;
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
};
