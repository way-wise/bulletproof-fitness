import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  exerciseLibrarySchemaAdmin,
  exerciseLibrarySchemaType,
  exerciseLibraryZapierSchemaType,
} from "@/schema/exerciseLibrarySchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";

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
  // Get all exercise library videos for dashboard (admin)
  getAllExerciseLibraryVideos: async (page = 1, limit = 10, search = "") => {
    try {
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where: any = search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                ExLibEquipment: {
                  some: {
                    equipment: {
                      name: { contains: search, mode: "insensitive" as const },
                    },
                  },
                },
              },
              {
                ExLibBodyPart: {
                  some: {
                    bodyPart: {
                      name: { contains: search, mode: "insensitive" as const },
                    },
                  },
                },
              },
              {
                ExLibRak: {
                  some: {
                    rack: {
                      name: { contains: search, mode: "insensitive" as const },
                    },
                  },
                },
              },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.exerciseLibraryVideo.count({ where });

      // Get paginated data with junction tables
      const exercises = await prisma.exerciseLibraryVideo.findMany({
        where,
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
        },
      });

      if (!exercise) {
        throw new Error("Exercise library video not found");
      }

      if (session?.user?.id && session?.session?.id) {
        const { id: userId } = session.user;
        const { id: sessionId, ipAddress, userAgent } = session.session;

        const existView = await prisma.userView.findFirst({
          where: {
            libraryId: id,
            userId,
            sessionId,
          },
        });

        if (!existView) {
          await prisma.userView.create({
            data: {
              libraryId: id,
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
            create: { libraryId: id, totalViews: 1 },
          });
        }
      }

      console.log("exercise", exercise);

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

  createExerciseLibrary: async (data: exerciseLibrarySchemaType) => {
    if (!zapierExerciseTriggerHook) {
      throw new HTTPException(500, {
        message: "Zapier exercise trigger hook not found",
      });
    }

    const response = await fetch(zapierExerciseTriggerHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

  // Get exercise library with comprehensive filters and pagination
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

      // Build comprehensive where clause
      const where: any = {
        isPublic: true,
        blocked: false,
        AND: [],
      };

      // Search filter
      if (search) {
        where.AND.push({
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            {
              ExLibEquipment: {
                some: {
                  equipment: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
            },
            {
              ExLibBodyPart: {
                some: {
                  bodyPart: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
            },
            {
              ExLibRak: {
                some: {
                  rack: {
                    name: { contains: search, mode: "insensitive" as const },
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
            name: { contains: username, mode: "insensitive" as const },
          },
        });
      }

      // Height filter - only apply if we have height constraints
      if (minHeight > 0 || maxHeight < 85) {
        where.AND.push({
          height: {
            not: null,
          },
        });
      }

      // Get total count
      const total = await prisma.exerciseLibraryVideo.count({
        where,
      });

      // Get paginated data with user info and junction tables
      const exercises = await prisma.exerciseLibraryVideo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
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
          reactions: {
            where: { userId: session?.user?.id },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              userId: true,
              reaction: true,
            },
          },
        },
      });

      // Transform data to include additional fields
      const transformedExercises = exercises
        .map((exercise) => {
          // Parse height to inches
          // let heightInInches: number | null = null;
          // if (exercise.height && exercise.height.trim() !== "") {
          //   const heightMatch = exercise.height.match(/(\d+)'(\d+)"/);
          //   if (heightMatch) {
          //     const feet = parseInt(heightMatch[1]);
          //     const inches = parseInt(heightMatch[2]);
          //     heightInInches = feet * 12 + inches;
          //   } else {
          //     heightInInches = parseInt(exercise.height || "0", 10);
          //   }
          // }

          // // Apply height filter after parsing
          // if ((minHeight > 0 || maxHeight < 85) && heightInInches !== null) {
          //   if (heightInInches < minHeight || heightInInches > maxHeight) {
          //     return null;
          //   }
          // }

          // Apply rating filter (using mock rating for now)
          if (minRating > 0) {
            const mockRating = Math.random() * 5;
            if (mockRating < minRating) {
              return null;
            }
          }

          return {
            id: exercise.id,
            title: exercise.title,
            videoUrl: exercise.videoUrl,
            equipment: {
              id: exercise.ExLibEquipment[0]?.equipment?.id || "default",
              name:
                exercise.ExLibEquipment[0]?.equipment?.name ||
                "Unknown Equipment",
            },
            bodyPart: {
              id: exercise.ExLibBodyPart[0]?.bodyPart?.id || "default",
              name:
                exercise.ExLibBodyPart[0]?.bodyPart?.name ||
                "Unknown Body Part",
            },
            rack: exercise.ExLibRak[0]
              ? {
                  id: exercise.ExLibRak[0].rack.id,
                  name: exercise.ExLibRak[0].rack.name,
                }
              : undefined,
            height: exercise.height || 0,
            userId: exercise.userId,
            user: exercise.user,
            contentStats: exercise.contentStats,
            reactions:
              exercise.reactions.length > 0 ? exercise.reactions : null,
            // Mock data for demo (replace with real data when available)
            views: Math.floor(Math.random() * 1000) + 100,
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 10),
            saves: Math.floor(Math.random() * 20),
            rating: Math.floor(Math.random() * 5) + 1,
            label: ["Yellow", "Green", "Blue", "Red"][
              Math.floor(Math.random() * 4)
            ],
            isPublic: exercise.isPublic,
            blocked: exercise.blocked,
            blockReason: exercise.blockReason,
            createdAt: exercise.createdAt.toISOString(),
            updatedAt: exercise.updatedAt.toISOString(),
          };
        })
        .filter(Boolean);

      return {
        data: transformedExercises,
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
  createExerciseLibraryFromYoutube: async (rawData: exerciseLibraryZapierSchemaType) => {
    // Parse the youtube string into key-value pairs
    const parseYoutubeString = (youtubeString: string) => {
      const pairs = youtubeString.split('|');
      const result: Record<string, any> = {};
      
      pairs.forEach(pair => {
        const [key, value] = pair.split(':').map(item => item.trim());
        if (key && value !== undefined) {
          // For now, treat all values as strings to be safe
          result[key] = value;
        }
      });
      
      return result;
    };
    
    // Extract data from the youtube string
    const data = parseYoutubeString(rawData.youtube);

    console.log("data", data);
    return {
      message: "Just testing",
      data: data
    }
    
    const result = await prisma.exerciseLibraryVideo.create({
      data: {
        title: data.title,
        videoUrl: data.embedUrl,
        height: Number(data.height),
        playUrl: data.playUrl,
        isPublic: true,
        publishedAt: data.publishedAt,
        ExLibEquipment: {
          connect: data.equipments?.map((equipmentId: string) => ({
            id: equipmentId,
          })) || [],
        },
        ExLibBodyPart: {
          connect: data.bodyParts?.map((bodyPartId: string) => ({
            id: bodyPartId,
          })) || [],
        },
        ExLibRak: {
          connect: data.racks?.map((rackId: string) => ({
            id: rackId,
          })) || [],
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
      
      return {
        success: true,
        message: "A video post has been created on library",
        data: result,
      }
  },
};
