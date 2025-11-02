import { getPaginationQuery } from "@/app/api/lib/pagination";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";

export const userService = {
  // Get all users
  getUsers: async (query: PaginationQuery & {
    role?: string;
    banned?: string;
    emailVerified?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const session = await getSession();

    const { skip, take, page, limit } = getPaginationQuery(query);

    // Build where clause with filters
    const where: any = {
      NOT: [
        {
          id: session?.user?.id,
        },
        {
          role: "admin", // Exclude admin users from the list
        },
      ],
    };
    const andConditions: any[] = [];

    // Search filter
    if (query.search) {
      andConditions.push({
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
        ],
      });
    }

    // Role filter
    if (query.role) {
      andConditions.push({
        role: query.role,
      });
    }

    // Banned filter
    if (query.banned !== undefined && query.banned !== "") {
      andConditions.push({
        banned: query.banned === "true",
      });
    }

    // Email verified filter
    if (query.emailVerified !== undefined && query.emailVerified !== "") {
      andConditions.push({
        emailVerified: query.emailVerified === "true",
      });
    }

    // Apply all conditions
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Build orderBy based on sortBy and sortOrder
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = (query.sortOrder || "desc") as "asc" | "desc";
    const orderBy: any = { [sortBy]: sortOrder };

    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.users.count({
        where,
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

    // 2. If a new email is being sent, validate it
    if (data.email) {
      const userWithThatEmail = await prisma.users.findUnique({
        where: {
          email: data.email.trim(),
        },
      });

      // Check if the email is taken by a DIFFERENT user
      if (userWithThatEmail && userWithThatEmail.id !== session.user.id) {
        throw new HTTPException(409, {
          message: "This email is already in use.",
        });
      }
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

  // Get user rewards/action history
  getUserRewards: async (userId: string) => {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    // Verify user exists
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new HTTPException(404, {
        message: "User not found",
      });
    }

    // Get user's action history with reward information
    const [views, ratings, reactions] = await prisma.$transaction([
      prisma.userView.findMany({
        where: {
          userId,
        },
        orderBy: {
          viewedAt: "desc",
        },
        take: 50,
      }),
      prisma.userRating.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      }),
      prisma.userReaction.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      }),
    ]);

    // Get reward points configuration
    const rewardPoints = await prisma.rewardPoints.findMany({
      where: {
        isActive: true,
      },
    });

    // Create a map of reward types to full reward info
    const rewardMap = new Map(
      rewardPoints.map((r) => [
        r.type,
        {
          points: r.points,
          description: r.description,
          name: r.name,
          isActive: r.isActive,
        },
      ]),
    );

    // Transform actions into reward history - ONLY include actions for active rewards
    const rewardHistory = [
      // Only show views if VIEW reward is active
      ...views
        .filter(() => rewardMap.has("VIEW"))
        .map((v) => {
          const rewardInfo = rewardMap.get("VIEW")!;
          return {
            id: v.id,
            type: "VIEW",
            points: rewardInfo.points,
            description: rewardInfo.description || "Viewed a video",
            name: rewardInfo.name || "View",
            isActive: rewardInfo.isActive,
            createdAt: v.viewedAt.toISOString(),
            updatedAt: v.viewedAt.toISOString(),
          };
        }),
      // Only show ratings if RATING reward is active
      ...ratings
        .filter(() => rewardMap.has("RATING"))
        .map((r) => {
          const rewardInfo = rewardMap.get("RATING")!;
          return {
            id: r.id,
            type: "RATING",
            points: rewardInfo.points,
            description: rewardInfo.description || "Rated a video",
            name: rewardInfo.name || "Rating",
            isActive: rewardInfo.isActive,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }),
      // Only show reactions if LIKE/DISLIKE rewards are active
      ...reactions
        .filter((r) => {
          const rewardType = r.reaction === "LIKE" ? "LIKE" : "DISLIKE";
          return rewardMap.has(rewardType);
        })
        .map((r) => {
          const rewardType = r.reaction === "LIKE" ? "LIKE" : "DISLIKE";
          const rewardInfo = rewardMap.get(rewardType)!;
          return {
            id: r.id,
            type: r.reaction,
            points: rewardInfo.points,
            description:
              rewardInfo.description || `${r.reaction.toLowerCase()}d a video`,
            name: rewardInfo.name || r.reaction,
            isActive: rewardInfo.isActive,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }),
    ];

    // Sort by date descending
    rewardHistory.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Calculate total points earned from history
    const totalPointsEarned = rewardHistory.reduce(
      (sum, item) => sum + item.points,
      0,
    );

    return {
      data: rewardHistory.slice(0, 50), // Return top 50 most recent
      meta: {
        total: rewardHistory.length,
        totalPointsEarned,
      },
    };
  },

  // Get leaderboard data with user stats
  getLeaderboard: async (query: PaginationQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);

    const [users, total] = await prisma.$transaction([
      prisma.users.findMany({
        where: {
          OR: [{ banned: false }, { banned: null }],
          totalPoints: {
            gt: 0,
          },
          AND: [
            {
              OR: [{ role: { not: "admin" } }, { role: null }],
            },
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
          OR: [{ banned: false }, { banned: null }],
          totalPoints: {
            gt: 0,
          },
          AND: [
            {
              OR: [{ role: { not: "admin" } }, { role: null }],
            },
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
      totalVideos:
        user._count.exerciseSetups + user._count.ExerciseLibraryVideo,
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
