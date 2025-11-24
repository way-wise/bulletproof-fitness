import { getPaginationQuery } from "@/app/api/lib/pagination";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  exerciseLibrarySchemaAdmin,
  exerciseLibrarySchemaType,
  exerciseLibraryZapierSchemaType,
} from "@/schema/exerciseLibrarySchema";
import type { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { actionService, awardPointsToUser } from "../actions/actionService";
import { extractPublicId } from "cloudinary-build-url";
import cloudinary from "cloudinary";

const zapierExerciseTriggerHook = process.env.ZAPIER_EXERCISE_TRIGGER_HOOK;

export const exerciseLibraryService = {
  createExerciseLibraryAdmin: async (
    data: InferType<typeof exerciseLibrarySchemaAdmin>,
  ) => {
    try {
      const exerciseLibrary = await prisma.exerciseLibraryVideo.create({
        data: {
          title: data.title,
          videoUrl: data.videoUrl,
          height: data.height,
          userId: data.userId,
          // Create junction table records for equipment
          ExLibEquipment: {
            create:
              (data.equipments?.filter(Boolean) as string[])?.map(
                (equipmentId) => ({
                  equipmentId: equipmentId,
                }),
              ) || [],
          },
          // Create junction table records for body parts
          ExLibBodyPart: {
            create:
              (data.bodyPart?.filter(Boolean) as string[])?.map(
                (bodyPartId) => ({
                  bodyPartId: bodyPartId,
                }),
              ) || [],
          },
          // Create junction table records for racks
          ExLibRak: {
            create:
              (data.rack?.filter(Boolean) as string[])?.map((rackId) => ({
                rackId: rackId,
              })) || [],
          },
        },
        include: {
          ExLibEquipment: {
            include: {
              equipment: true,
            },
          },
          ExLibBodyPart: {
            include: {
              bodyPart: true,
            },
          },
          ExLibRak: {
            include: {
              rack: true,
            },
          },
        },
      });

      return exerciseLibrary;
    } catch (error) {
      console.error("Error creating exercise library video:", error);
      throw error;
    }
  },
  // Get all exercise library videos for dashboard (admin) - OPTIMIZED
  getAllExerciseLibraryVideos: async (
    query: PaginationQuery & {
      bodyPartIds?: string;
      equipmentIds?: string;
      rackIds?: string;
      isPublic?: string;
      blocked?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ) => {
    try {
      const { skip, take, page, limit } = getPaginationQuery(query);

      // Build where clause with filters
      const where: any = {};
      const andConditions: any[] = [];

      // Search filter
      if (query.search) {
        andConditions.push({
          OR: [
            {
              title: { contains: query.search, mode: "insensitive" as const },
            },
            {
              ExLibEquipment: {
                some: {
                  equipment: {
                    name: {
                      contains: query.search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
            {
              ExLibBodyPart: {
                some: {
                  bodyPart: {
                    name: {
                      contains: query.search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
            {
              ExLibRak: {
                some: {
                  rack: {
                    name: {
                      contains: query.search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
          ],
        });
      }

      // Body part filter
      if (query.bodyPartIds) {
        const bodyPartIdsArray = query.bodyPartIds.split(",").filter(Boolean);
        if (bodyPartIdsArray.length > 0) {
          andConditions.push({
            ExLibBodyPart: {
              some: {
                bodyPartId: { in: bodyPartIdsArray },
              },
            },
          });
        }
      }

      // Equipment filter
      if (query.equipmentIds) {
        const equipmentIdsArray = query.equipmentIds.split(",").filter(Boolean);
        if (equipmentIdsArray.length > 0) {
          andConditions.push({
            ExLibEquipment: {
              some: {
                equipmentId: { in: equipmentIdsArray },
              },
            },
          });
        }
      }

      // Rack filter
      if (query.rackIds) {
        const rackIdsArray = query.rackIds.split(",").filter(Boolean);
        if (rackIdsArray.length > 0) {
          andConditions.push({
            ExLibRak: {
              some: {
                rackId: { in: rackIdsArray },
              },
            },
          });
        }
      }

      // isPublic filter
      if (query.isPublic !== undefined && query.isPublic !== "") {
        andConditions.push({
          isPublic: query.isPublic === "true",
        });
      }

      // blocked filter
      if (query.blocked !== undefined && query.blocked !== "") {
        andConditions.push({
          blocked: query.blocked === "true",
        });
      }

      // Apply all conditions
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      // Build orderBy based on sortBy and sortOrder
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = (query.sortOrder || "desc") as "asc" | "desc";
      const orderBy: any = {};

      // Handle nested sorting for user name
      if (sortBy === "userName") {
        orderBy.user = { name: sortOrder };
      } else {
        orderBy[sortBy] = sortOrder;
      }

      // OPTIMIZED: Separate queries to reduce connection pool pressure
      const exercises = await prisma.exerciseLibraryVideo.findMany({
        where,
        skip,
        take,
        orderBy,
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
          // Optimized user selection
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Optimized equipment selection - limit to first 3 for dashboard
          ExLibEquipment: {
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
          ExLibBodyPart: {
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
          ExLibRak: {
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
      const total = await prisma.exerciseLibraryVideo.count({ where });

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
      console.error("Error fetching all exercise library videos:", error);
      throw new Error("Failed to fetch exercise library videos.");
    }
  },

  // Get single exercise library video by ID
  getExerciseLibraryVideoById: async (id: string) => {
    const session = await getSession();
    try {
      const exercise = await prisma.exerciseLibraryVideo.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ExLibEquipment: {
            include: {
              equipment: true,
            },
          },
          ExLibBodyPart: {
            include: {
              bodyPart: true,
            },
          },
          ExLibRak: {
            include: {
              rack: true,
            },
          },
          contentStats: true,
          ...(session?.user?.id && {
            ratings: {
              where: { userId: session?.user?.id },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                rating: true,
              },
            },
          }),
        },
      });

      if (!exercise) {
        throw new Error("Exercise library video not found");
      }

      // Track views for stats (no points awarded since VIEW reward doesn't exist)
      if (session?.user?.id || session?.session?.id) {
        try {
          await actionService.recordView(id, "lib");
        } catch (viewError) {
          // Log error but don't fail the request if view tracking fails
          console.error("Error recording view:", viewError);
        }
      }

      return exercise;
    } catch (error) {
      console.error("Error fetching exercise library video:", error);
      throw new Error("Failed to fetch exercise library video.");
    }
  },

  // Update exercise library video
  updateExerciseLibraryVideo: async (
    id: string,
    data: InferType<typeof exerciseLibrarySchemaAdmin>,
  ) => {
    try {
      // First, delete existing junction table records
      await prisma.exLibEquipment.deleteMany({
        where: { exLibraryId: id },
      });
      await prisma.exLibBodyPart.deleteMany({
        where: { exLibraryId: id },
      });
      await prisma.exLibRak.deleteMany({
        where: { exLibraryId: id },
      });

      // Then update the exercise library and create new junction table records
      const exercise = await prisma.exerciseLibraryVideo.update({
        where: { id },
        data: {
          title: data.title,
          videoUrl: data.videoUrl,
          height: data.height,
          updatedAt: new Date(),
          // Create new junction table records for equipment
          ExLibEquipment: {
            create:
              (data.equipments?.filter(Boolean) as string[])?.map(
                (equipmentId) => ({
                  equipmentId: equipmentId,
                }),
              ) || [],
          },
          // Create new junction table records for body parts
          ExLibBodyPart: {
            create:
              (data.bodyPart?.filter(Boolean) as string[])?.map(
                (bodyPartId) => ({
                  bodyPartId: bodyPartId,
                }),
              ) || [],
          },
          // Create new junction table records for racks
          ExLibRak: {
            create:
              (data.rack?.filter(Boolean) as string[])?.map((rackId) => ({
                rackId: rackId,
              })) || [],
          },
        },
        include: {
          ExLibEquipment: {
            include: {
              equipment: true,
            },
          },
          ExLibBodyPart: {
            include: {
              bodyPart: true,
            },
          },
          ExLibRak: {
            include: {
              rack: true,
            },
          },
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error updating exercise library video:", error);
      throw new Error("Failed to update exercise library video.");
    }
  },

  // Delete exercise library video
  deleteExerciseLibraryVideo: async (id: string) => {
    try {
      const exercise = await prisma.exerciseLibraryVideo.delete({
        where: { id },
      });

      return exercise;
    } catch (error) {
      console.error("Error deleting exercise library video:", error);
      throw new Error("Failed to delete exercise library video.");
    }
  },

  // Block exercise library video
  blockExerciseLibraryVideo: async (id: string, blockReason: string) => {
    try {
      const exercise = await prisma.exerciseLibraryVideo.update({
        where: { id },
        data: {
          blocked: true,
          blockReason,
          updatedAt: new Date(),
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error blocking exercise library video:", error);
      throw new Error("Failed to block exercise library video.");
    }
  },

  // Unblock exercise library video
  unblockExerciseLibraryVideo: async (id: string) => {
    try {
      const exercise = await prisma.exerciseLibraryVideo.update({
        where: { id },
        data: {
          blocked: false,
          blockReason: null,
          updatedAt: new Date(),
        },
      });

      return exercise;
    } catch (error) {
      console.error("Error unblocking exercise library video:", error);
      throw new Error("Failed to unblock exercise library video.");
    }
  },

  // Update exercise library video status (publish/unpublish)
  updateExerciseLibraryVideoStatus: async (
    id: string,
    data: { isPublic?: boolean; blocked?: boolean; blockReason?: string },
  ) => {
    try {
      const updateData: {
        updatedAt: Date;
        isPublic?: boolean;
        blocked?: boolean;
        blockReason?: string;
      } = {
        updatedAt: new Date(),
      };

      if (data.isPublic !== undefined) {
        updateData.isPublic = data.isPublic;
      }

      if (data.blocked !== undefined) {
        updateData.blocked = data.blocked;
      }

      if (data.blockReason !== undefined) {
        updateData.blockReason = data.blockReason;
      }

      const exercise = await prisma.exerciseLibraryVideo.update({
        where: { id },
        data: updateData,
      });

      return exercise;
    } catch (error) {
      console.error("Error updating exercise library video status:", error);
      throw new Error("Failed to update exercise library video status.");
    }
  },

  // Create exercise library from public (Through Zapier)
  createExerciseLibrary: async (data: exerciseLibrarySchemaType) => {
    if (!zapierExerciseTriggerHook) {
      throw new HTTPException(500, {
        message: "Zapier exercise trigger hook not found",
      });
    }

    // Get Equipment names
    const equipments = await prisma.equipment.findMany({
      where: {
        id: {
          in: data.equipments,
        },
      },
    });

    // Get Body Part names
    const bodyParts = await prisma.bodyPart.findMany({
      where: {
        id: {
          in: data.bodyPart,
        },
      },
    });

    // Get Rack names
    const racks = await prisma.rack.findMany({
      where: {
        id: {
          in: data.rack,
        },
      },
    });

    // Construct equipments, bodyPart, and racks for zapier with both id and name
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

    const response = await fetch(zapierExerciseTriggerHook, {
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

  // Get exercise library data for a user (public access)
  getExerciseLibrary: async () => {
    try {
      const exercises = await prisma.exerciseLibraryVideo.findMany({});

      return exercises;
    } catch (error) {
      console.error("Error fetching exercise library:", error);
      throw new Error("Failed to fetch exercise library data.");
    }
  },

  // Get exercise library with comprehensive filters and pagination (OPTIMIZED)
  getExerciseLibraryWithFilters: async (params: {
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
              ExLibEquipment: {
                some: {
                  equipment: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
            {
              ExLibBodyPart: {
                some: {
                  bodyPart: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
            {
              ExLibRak: {
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
          ExLibBodyPart: {
            some: {
              bodyPartId: { in: bodyPartIds },
            },
          },
        });
      }

      // Equipment filter
      if (equipmentIds.length > 0) {
        where.AND.push({
          ExLibEquipment: {
            some: {
              equipmentId: { in: equipmentIds },
            },
          },
        });
      }

      // Rack filter
      if (rackIds.length > 0) {
        where.AND.push({
          ExLibRak: {
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

      // FIXED: Rating filter - changed from 'every' to 'some'
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
      const exercises = await prisma.exerciseLibraryVideo.findMany({
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
          // Optimized user selection
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Optimized body part selection
          ExLibBodyPart: {
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
      const total = await prisma.exerciseLibraryVideo.count({ where });

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
      console.error("Error fetching exercise library with filters:", error);
      throw new Error("Failed to fetch exercise library data with filters.");
    }
  },

  getExerciseLibraryVideos: async () => {
    const session = await getSession();
    try {
      const exercises = await prisma.exerciseLibraryVideo.findMany({
        where: {
          userId: session?.user?.id,
        },
      });

      return exercises;
    } catch (error) {
      console.error("Error fetching exercise library:", error);
      throw new Error("Failed to fetch exercise library data.");
    }
  },

  createExerciseLibraryFromYoutube: async (
    data: exerciseLibraryZapierSchemaType,
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
    const result = await prisma.exerciseLibraryVideo.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        height: parseFloat(data.height),
        playUrl: data.playUrl,
        isPublic: true,
        publishedAt: data.publishedAt,
        userId: data.userId,
        ExLibEquipment: {
          create: equipments.map((equipmentId) => ({
            equipmentId: equipmentId,
          })),
        },
        ExLibBodyPart: {
          create: bodyPart.map((bodyPartId) => ({
            bodyPartId: bodyPartId,
          })),
        },
        ExLibRak: {
          create: racks.map((rackId) => ({
            rackId: rackId,
          })),
        },
      },
    });

    await awardPointsToUser(
      data.userId,
      "UPLOAD_LIBRARY",
      "Exercise Library",
      "Exercise Library Video upload Reward",
      result.id, // reference ID for approval when published
      false, // pending approval until content is published
    );

    return {
      success: true,
      message: "A video post has been created on library",
      data: result,
    };
  },
};
