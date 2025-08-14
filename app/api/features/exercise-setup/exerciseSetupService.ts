import { getPaginationQuery } from "@/app/api/lib/pagination";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  exerciseSetupSchema,
  exerciseSetupSchemaAdmin,
  exerciseSetupZapierSchemaType,
} from "@/schema/exerciseSetupSchema";
import type { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { awardPointsToUser } from "../actions/actionService";

const zapierSetupTriggerHook = process.env.ZAPIER_SETUP_TRIGGER_HOOK;

export const exerciseSetupService = {
  createExerciseSetupAdmin: async (
    data: InferType<typeof exerciseSetupSchemaAdmin>,
  ) => {
    // Create the exercise setup with junction table relations
    const exerciseSetup = await prisma.exerciseSetup.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        height: data.height,
        userId: data.userId,
        // Pump by numbers fields
        isolatorHole:
          data.isolatorHole && data.isolatorHole.trim() !== ""
            ? data.isolatorHole
            : null,
        yellow: data.yellow && data.yellow.trim() !== "" ? data.yellow : null,
        green: data.green && data.green.trim() !== "" ? data.green : null,
        blue: data.blue && data.blue.trim() !== "" ? data.blue : null,
        red: data.red && data.red.trim() !== "" ? data.red : null,
        purple: data.purple && data.purple.trim() !== "" ? data.purple : null,
        orange: data.orange && data.orange.trim() !== "" ? data.orange : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Create junction table records for equipment
        ExSetupEquipment: {
          create:
            (data.equipment?.filter(Boolean) as string[])?.map(
              (equipmentId) => ({
                equipmentId: equipmentId,
              }),
            ) || [],
        },
        // Create junction table records for body parts
        ExSetupBodyPart: {
          create:
            (data.bodyPart?.filter(Boolean) as string[])?.map((bodyPartId) => ({
              bodyPartId: bodyPartId,
            })) || [],
        },
        // Create junction table records for racks
        ExSetupRak: {
          create:
            (data.rack?.filter(Boolean) as string[])?.map((rackId) => ({
              rackId: rackId,
            })) || [],
        },
      },
      include: {
        ExSetupEquipment: {
          include: {
            equipment: true,
          },
        },
        ExSetupBodyPart: {
          include: {
            bodyPart: true,
          },
        },
        ExSetupRak: {
          include: {
            rack: true,
          },
        },
      },
    });

    return exerciseSetup;
  },

  // Get all exercise setup videos for dashboard (admin) - OPTIMIZED
  getAllExerciseSetupVideos: async (query: PaginationQuery) => {
    try {
      const { skip, take, page, limit } = getPaginationQuery(query);

      // Build optimized where clause for search
      const where: any = query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" as const } },
              {
                ExSetupEquipment: {
                  some: {
                    equipment: {
                      name: { contains: query.search, mode: "insensitive" as const },
                    },
                  },
                },
              },
              {
                ExSetupBodyPart: {
                  some: {
                    bodyPart: {
                      name: { contains: query.search, mode: "insensitive" as const },
                    },
                  },
                },
              },
              {
                ExSetupRak: {
                  some: {
                    rack: {
                      name: { contains: query.search, mode: "insensitive" as const },
                    },
                  },
                },
              },
            ],
          }
        : {};

      // OPTIMIZED: Separate queries to reduce connection pool pressure
      const exercises = await prisma.exerciseSetup.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          videoUrl: true,
          height: true,
          isPublic: true,
          blocked: true,
          blockReason: true,
          createdAt: true,
          updatedAt: true,
          // Pump by numbers fields for dashboard
          isolatorHole: true,
          yellow: true,
          green: true,
          blue: true,
          red: true,
          purple: true,
          orange: true,
          // Optimized user selection
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Optimized equipment selection - limit to first 3 for dashboard
          ExSetupEquipment: {
            select: {
              equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 3,
          },
          // Optimized body part selection - limit to first 3 for dashboard
          ExSetupBodyPart: {
            select: {
              bodyPart: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 3,
          },
          // Optimized rack selection - limit to first 3 for dashboard
          ExSetupRak: {
            select: {
              rack: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 3,
          },
        },
      });

      // Separate count query for better performance
      const total = await prisma.exerciseSetup.count({ where });

      return {
        data: exercises,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching all exercise setup videos:", error);
      throw new Error("Failed to fetch exercise setup videos.");
    }
  },

  // Get user videos for profile page
  getUserVideos: async (userId: string, page = 1, limit = 10) => {
    try {
      const skip = (page - 1) * limit;

      const [exercises, total] = await Promise.all([
        prisma.exerciseSetup.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            ExSetupEquipment: {
              include: {
                equipment: true,
              },
            },
            ExSetupBodyPart: {
              include: {
                bodyPart: true,
              },
            },
            ExSetupRak: {
              include: {
                rack: true,
              },
            },
            contentStats: true,
            views: {
              select: {
                id: true,
              },
            },
            ratings: {
              select: {
                id: true,
                rating: true,
              },
            },
            reactions: {
              where: {
                reaction: "LIKE",
              },
              select: {
                id: true,
              },
            },
          },
        }),
        prisma.exerciseSetup.count({
          where: { userId },
        }),
      ]);

      // Transform data to include view, like, and rating counts
      const transformedExercises = exercises.map((exercise) => ({
        ...exercise,
        views: exercise.views.length,
        likes: exercise.reactions.length,
        rating:
          exercise.ratings.length > 0
            ? exercise.ratings.reduce((sum, r) => sum + r.rating, 0) /
              exercise.ratings.length
            : 0,
      }));

      return {
        data: transformedExercises,
        meta: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Error fetching user videos:", error);
      throw new Error("Failed to fetch user videos.");
    }
  },

  // Get single exercise setup video by ID
  getExerciseSetupVideoById: async (id: string) => {
    const session = await getSession();
    try {
      const exercise = await prisma.exerciseSetup.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ExSetupEquipment: {
            include: {
              equipment: true,
            },
          },
          ExSetupBodyPart: {
            include: {
              bodyPart: true,
            },
          },
          ExSetupRak: {
            include: {
              rack: true,
            },
          },
          contentStats: true,
          ratings: {
            where: { userId: session?.user?.id },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              rating: true,
            },
          },
        },
      });

      if (!exercise) {
        throw new Error("Exercise setup video not found");
      }

      if (session?.user?.id && session?.session?.id) {
        const { id: userId } = session.user;
        const { id: sessionId, ipAddress, userAgent } = session.session;

        const existView = await prisma.userView.findFirst({
          where: {
            exerciseId: id,
            userId,
            sessionId,
          },
        });

        if (!existView) {
          await prisma.userView.create({
            data: {
              exerciseId: id,
              userId,
              sessionId,
              ipAddress,
              userAgent,
              viewedAt: new Date(),
            },
          });

          const contentStats = await prisma.contentStats.findFirst({
            where: { exerciseId: id },
          });

          await prisma.contentStats.upsert({
            where: { id: contentStats?.id ?? "__new" },
            update: { totalViews: { increment: 1 } },
            create: { exerciseId: id, totalViews: 1 },
          });
        }
      }

      return exercise;
    } catch (error) {
      console.error("Error fetching exercise setup video:", error);
      throw new Error("Failed to fetch exercise setup video.");
    }
  },

  // Update exercise setup video
  updateExerciseSetupVideo: async (
    id: string,
    data: InferType<typeof exerciseSetupSchemaAdmin>,
  ) => {
    try {
      // First, delete existing junction table records
      await prisma.exSetupEquipment.deleteMany({
        where: { exSetupId: id },
      });
      await prisma.exSetupBodyPart.deleteMany({
        where: { exSetupId: id },
      });
      await prisma.exSetupRak.deleteMany({
        where: { exSetupId: id },
      });

      // Then update the exercise setup and create new junction table records
      const exercise = await prisma.exerciseSetup.update({
        where: { id },
        data: {
          title: data.title,
          videoUrl: data.videoUrl,
          height: data.height,
          // Pump by numbers fields
          isolatorHole:
            data.isolatorHole && data.isolatorHole.trim() !== ""
              ? data.isolatorHole
              : null,
          yellow: data.yellow && data.yellow.trim() !== "" ? data.yellow : null,
          green: data.green && data.green.trim() !== "" ? data.green : null,
          blue: data.blue && data.blue.trim() !== "" ? data.blue : null,
          red: data.red && data.red.trim() !== "" ? data.red : null,
          purple: data.purple && data.purple.trim() !== "" ? data.purple : null,
          orange: data.orange && data.orange.trim() !== "" ? data.orange : null,
          updatedAt: new Date(),
          // Create new junction table records for equipment
          ExSetupEquipment: {
            create:
              (data.equipment?.filter(Boolean) as string[])?.map(
                (equipmentId) => ({
                  equipmentId: equipmentId,
                }),
              ) || [],
          },
          // Create new junction table records for body parts
          ExSetupBodyPart: {
            create:
              (data.bodyPart?.filter(Boolean) as string[])?.map(
                (bodyPartId) => ({
                  bodyPartId: bodyPartId,
                }),
              ) || [],
          },
          // Create new junction table records for racks
          ExSetupRak: {
            create:
              (data.rack?.filter(Boolean) as string[])?.map((rackId) => ({
                rackId: rackId,
              })) || [],
          },
        },
        include: {
          ExSetupEquipment: {
            include: {
              equipment: true,
            },
          },
          ExSetupBodyPart: {
            include: {
              bodyPart: true,
            },
          },
          ExSetupRak: {
            include: {
              rack: true,
            },
          },
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error updating exercise setup video:", error);
      throw new Error("Failed to update exercise setup video.");
    }
  },

  // Delete exercise library video
  deleteExerciseLibraryVideo: async (id: string) => {
    try {
      const exercise = await prisma.exerciseSetup.delete({
        where: { id },
      });

      return exercise;
    } catch (error) {
      console.error("Error deleting exercise library video:", error);
      throw new Error("Failed to delete exercise library video.");
    }
  },

  // Block exercise setup video
  blockExerciseSetupVideo: async (id: string, blockReason: string) => {
    try {
      const exercise = await prisma.exerciseSetup.update({
        where: { id },
        data: {
          blocked: true,
          blockReason,
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error blocking exercise library video:", error);
      throw new Error("Failed to block exercise library video.");
    }
  },

  // Unblock exercise setup video
  unblockExerciseSetupVideo: async (id: string) => {
    try {
      const exercise = await prisma.exerciseSetup.update({
        where: { id },
        data: {
          blocked: false,
          blockReason: null,
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error unblocking exercise library video:", error);
      throw new Error("Failed to unblock exercise library video.");
    }
  },

  // Update exercise setup video status (publish/unpublish)
  updateExerciseSetupVideoStatus: async (
    id: string,
    data: { isPublic?: boolean; blocked?: boolean; blockReason?: string },
  ) => {
    try {
      const updateData: {
        isPublic?: boolean;
        blocked?: boolean;
        blockReason?: string | null;
      } = {};

      if (data.isPublic !== undefined) {
        updateData.isPublic = data.isPublic;
      }

      if (data.blocked !== undefined) {
        updateData.blocked = data.blocked;
      }

      if (data.blockReason !== undefined) {
        updateData.blockReason = data.blockReason;
      }

      const exercise = await prisma.exerciseSetup.update({
        where: { id },
        data: updateData,
      });

      return exercise;
    } catch (error) {
      console.error("Error updating exercise library video status:", error);
      throw new Error("Failed to update exercise library video status.");
    }
  },
  // Get exercise setup with comprehensive filters and pagination (OPTIMIZED)
  getExerciseSetupWithFilters: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    bodyPartIds?: string[];
    equipmentIds?: string[];
    rackIds?: string[];
    username?: string;
    minHeight?: number;
    maxHeight?: number;
    minRating?: number;
    sortBy?: "title" | "createdAt" | "views" | "likes";
    sortOrder?: "asc" | "desc";
  }) => {
    const session = await getSession();
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        bodyPartIds = [],
        equipmentIds = [],
        rackIds = [],
        username = "",
        minHeight = 0,
        maxHeight = 85,
        minRating = 0,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      const skip = (page - 1) * limit;

      // Build optimized where clause
      const where: any = {
        isPublic: true,
        blocked: false,
        AND: [],
      };

      // Search filter - optimized
      if (search) {
        where.AND.push({
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            {
              ExSetupEquipment: {
                some: {
                  equipment: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
            {
              ExSetupBodyPart: {
                some: {
                  bodyPart: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
            {
              ExSetupRak: {
                some: {
                  rack: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        });
      }

      // Body part filter
      if (bodyPartIds.length > 0) {
        where.AND.push({
          ExSetupBodyPart: {
            some: {
              bodyPartId: { in: bodyPartIds },
            },
          },
        });
      }

      // Equipment filter
      if (equipmentIds.length > 0) {
        where.AND.push({
          ExSetupEquipment: {
            some: {
              equipmentId: { in: equipmentIds },
            },
          },
        });
      }

      // Rack filter
      if (rackIds.length > 0) {
        where.AND.push({
          ExSetupRak: {
            some: {
              rackId: { in: rackIds },
            },
          },
        });
      }

      // Username filter
      if (username) {
        where.AND.push({
          user: {
            name: { contains: username, mode: "insensitive" },
          },
        });
      }

      // FIXED: Rating filter - using 'some' for correct logic
      if (minRating > 0) {
        where.AND.push({
          contentStats: {
            some: {
              avgRating: { gte: minRating, lte: 5 },
            },
          },
        });
      }

      // Height filter - only apply if we have height constraints
      if (minHeight > 0 || maxHeight < 85) {
        where.AND.push({
          height: {
            gte: minHeight,
            lte: maxHeight,
          },
        });
      }

      // OPTIMIZED: Separate queries to reduce connection pool pressure
      const exercises = await prisma.exerciseSetup.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          title: true,
          videoUrl: true,
          height: true,
          createdAt: true,
          updatedAt: true,
          // Pump by numbers fields
          isolatorHole: true,
          yellow: true,
          green: true,
          blue: true,
          red: true,
          purple: true,
          orange: true,
          // Optimized user selection
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Optimized body part selection
          ExSetupBodyPart: {
            select: {
              bodyPart: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 1, // Limit to first body part for performance
          },
          // Only load contentStats if needed for sorting or filtering
          ...(sortBy === "views" || sortBy === "likes" || minRating > 0
            ? {
                contentStats: {
                  select: {
                    totalViews: true,
                    totalLikes: true,
                    avgRating: true,
                  },
                  take: 1,
                },
              }
            : {}),
          // Only load user reactions if user is logged in
          ...(session?.user?.id
            ? {
                reactions: {
                  where: { userId: session.user.id },
                  select: {
                    id: true,
                    reaction: true,
                  },
                  take: 1,
                },
              }
            : {}),
        },
      });

      // Separate count query for better performance
      const total = await prisma.exerciseSetup.count({ where });

      return {
        data: exercises,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Error fetching exercise setup with filters:", error);
      throw new Error("Failed to fetch exercise setup data with filters.");
    }
  },
  // Create exercise setup from public (Through Zapier)
  createExerciseSetup: async (data: InferType<typeof exerciseSetupSchema>) => {
    if (!zapierSetupTriggerHook) {
      throw new HTTPException(500, {
        message: "Zapier exercise trigger hook not found",
      });
    }

    const equipments = await prisma.equipment.findMany({
      where: {
        id: {
          in: data.equipments,
        },
      },
    });

    const bodyParts = await prisma.bodyPart.findMany({
      where: {
        id: {
          in: data.bodyPart,
        },
      },
    });

    const racks = await prisma.rack.findMany({
      where: {
        id: {
          in: data.rack,
        },
      },
    });

    const formData = {
      ...data,
      equipments: equipments.map((equipment) => ({
        id: equipment.id,
        name: equipment.name,
      })),
      bodyPart: bodyParts.map((bodyPart) => ({
        id: bodyPart.id,
        name: bodyPart.name,
      })),
      rack: racks.map((rack) => ({
        id: rack.id,
        name: rack.name,
      })),
    };

    const response = await fetch(zapierSetupTriggerHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new HTTPException(500, { message: "Zapier call failed" });
    }

    const result = await response.json();

    return {
      success: true,
      message: "Video uploaded successfully, awaiting approval",
      data: result,
    };
  },
  // Create exercise setup from public (Through Youtube to Zapier)
  createExerciseSetupFromYoutube: async (
    data: exerciseSetupZapierSchemaType,
  ) => {
    // Transform string to an array for equipments, bodyPart, and racks
    const equipments = data.equipments
      .split(",")
      .map((equipment) => equipment.trim());
    const bodyPart = data.bodyPart
      .split(",")
      .map((bodyPart) => bodyPart.trim());
    const racks = data.racks.split(",").map((rack) => rack.trim());

    // Create the exercise library video
    const result = await prisma.exerciseSetup.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        height: parseFloat(data.height),
        playUrl: data.playUrl,
        isPublic: true,
        publishedAt: data.publishedAt,
        isolatorHole: data.isolatorHole,
        yellow: data.yellow,
        green: data.green,
        blue: data.blue,
        red: data.red,
        purple: data.purple,
        orange: data.orange,
        userId: data.userId,
        ExSetupEquipment: {
          create: equipments.map((equipmentId) => ({
            equipmentId: equipmentId,
          })),
        },
        ExSetupBodyPart: {
          create: bodyPart.map((bodyPartId) => ({
            bodyPartId: bodyPartId,
          })),
        },
        ExSetupRak: {
          create: racks.map((rackId) => ({
            rackId: rackId,
          })),
        },
      },
    });

    await awardPointsToUser(
      data.userId,
      "UPLOAD_EXERCISE",
      "Exercise Setup",
      "Exercise Setup Video upload Reward",
    );

    return {
      success: true,
      message: "A video post has been created on library",
      data: result,
    };
  },
};
