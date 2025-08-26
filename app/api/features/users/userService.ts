import { getPaginationQuery } from "@/app/api/lib/pagination";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";

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
          ...(query.search
            ? {
                OR: [
                  {
                    name: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.users.count({
        where: {
          NOT: {
            id: session?.user?.id,
          },
          ...(query.search
            ? {
                OR: [
                  {
                    name: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
      }),
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

  // Get user suggestions for search
  getUserSuggestions: async (query: { search: string; limit?: string }) => {
    const session = await getSession();
    const limit = parseInt(query.limit || "5");

    const users = await prisma.users.findMany({
      where: {
        NOT: {
          id: session?.user?.id,
        },
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return users;
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

  // Get leaderboard data with user stats
  getLeaderboard: async (query: PaginationQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);
    
    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        where: {
          OR: [
            { banned: false },
            { banned: null }
          ],
          totalPoints: {
            gt: 0,
          },
          AND: [
            {
              OR: [
                { role: { not: "admin" } },
                { role: null }
              ]
            }
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          totalPoints: true,
          createdAt: true,
          _count: {
            select: {
              exerciseSetups: {
                where: {
                  isPublic: true,
                  blocked: false,
                },
              },
              ExerciseLibraryVideo: {
                where: {
                  isPublic: true,
                  blocked: false,
                },
              },
              views: true,
              ratings: true,
              reactions: {
                where: {
                  reaction: "LIKE",
                },
              },
            },
          },
        },
        orderBy: {
          totalPoints: "desc",
        },
        skip,
        take,
      }),
      prisma.users.count({
        where: {
          OR: [
            { banned: false },
            { banned: null }
          ],
          totalPoints: {
            gt: 0,
          },
          AND: [
            {
              OR: [
                { role: { not: "admin" } },
                { role: null }
              ]
            }
          ],
        },
      }),
    ]);

    // Transform data to include computed stats
    const leaderboardData = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      exerciseSetupCount: user._count.exerciseSetups,
      exerciseLibraryCount: user._count.ExerciseLibraryVideo,
      totalVideos: user._count.exerciseSetups + user._count.ExerciseLibraryVideo,
      viewsCount: user._count.views,
      ratingsCount: user._count.ratings,
      likesCount: user._count.reactions,
    }));

    return {
      data: leaderboardData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
