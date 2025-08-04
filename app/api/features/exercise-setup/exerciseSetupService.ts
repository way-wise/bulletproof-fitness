import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  exerciseSetupSchema,
  exerciseSetupSchemaAdmin,
  exerciseSetupZapierSchemaType,
} from "@/schema/exerciseSetupSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";

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

  // Get all exercise library videos for dashboard (admin)
  getAllExerciseSetupVideos: async (page = 1, limit = 10, search = "") => {
    try {
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where = search
        ? {
            OR: [
              { title: { contains: search } },
              {
                ExSetupEquipment: {
                  some: {
                    equipment: {
                      name: { contains: search },
                    },
                  },
                },
              },
              {
                ExSetupBodyPart: {
                  some: {
                    bodyPart: {
                      name: { contains: search },
                    },
                  },
                },
              },
              {
                ExSetupRak: {
                  some: {
                    rack: {
                      name: { contains: search },
                    },
                  },
                },
              },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.exerciseSetup.count({ where });

      // Get paginated data with user relation and junction tables
      const exercises = await prisma.exerciseSetup.findMany({
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

      return {
        data: exercises,
        meta: {
          total,
          page,
          limit,
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
      console.log("id", id);
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

      console.log("Database query result:", exercise);

      if (!exercise) {
        console.log("No exercise setup found with id:", id);
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
          console.log("New view");
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
          updatedAt: new Date(),
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
          updatedAt: new Date(),
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
        updatedAt: Date;
        isPublic?: boolean;
        blocked?: boolean;
        blockReason?: string | null;
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

      const where: any = {
        isPublic: true,
        blocked: false,
        AND: [],
      };

      // Search filter
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

      // Body parts
      if (bodyPartIds.length > 0) {
        where.AND.push({
          ExSetupBodyPart: {
            some: {
              bodyPartId: { in: bodyPartIds },
            },
          },
        });
      }

      // Equipments
      if (equipmentIds.length > 0) {
        where.AND.push({
          ExSetupEquipment: {
            some: {
              equipmentId: { in: equipmentIds },
            },
          },
        });
      }

      // Racks
      if (rackIds.length > 0) {
        where.AND.push({
          ExSetupRak: {
            some: {
              rackId: { in: rackIds },
            },
          },
        });
      }

      // Username
      if (username) {
        where.AND.push({
          user: {
            name: { contains: username, mode: "insensitive" },
          },
        });
      }

      console.log("minHeight", minHeight);
      console.log("maxHeight", maxHeight);

      // Height filter - only apply if we have height constraints
      if (minHeight > 0 || maxHeight < 85) {
        where.AND.push({
          height: {
            gte: minHeight,
            lte: maxHeight,
          },
        });
      }

      const [exercises, total] = await prisma.$transaction([
        prisma.exerciseSetup.findMany({
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
        }),
        prisma.exerciseSetup.count({
          where,
        }),
      ]);

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

          // if (
          //   (minHeight > 0 || maxHeight < 85) &&
          //   heightInInches !== null &&
          //   (heightInInches < minHeight || heightInInches > maxHeight)
          // ) {
          //   return null;
          // }

          if (minRating > 0) {
            const mockRating = Math.floor(Math.random() * 5) + 1;
            if (mockRating < minRating) {
              return null;
            }
          }

          return {
            id: exercise.id,
            title: exercise.title,
            videoUrl: exercise.videoUrl,
            equipment: {
              id: exercise.ExSetupEquipment[0]?.equipment?.id || "default",
              name:
                exercise.ExSetupEquipment[0]?.equipment?.name ||
                "Unknown Equipment",
            },
            bodyPart: {
              id: exercise.ExSetupBodyPart[0]?.bodyPart?.id || "default",
              name:
                exercise.ExSetupBodyPart[0]?.bodyPart?.name ||
                "Unknown Body Part",
            },
            rack: exercise.ExSetupRak[0]
              ? {
                  id: exercise.ExSetupRak[0].rack.id,
                  name: exercise.ExSetupRak[0].rack.name,
                }
              : undefined,
            height: exercise.height || 0,
            userId: exercise.userId,
            user: exercise.user,
            contentStats: exercise.contentStats,
            reactions:
              exercise.reactions.length > 0 ? exercise.reactions : null,
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
  // Create exercise setup from public (Through Zapier)
  createExerciseSetup: async (data: InferType<typeof exerciseSetupSchema>) => {
    if (!zapierSetupTriggerHook) {
      throw new HTTPException(500, {
        message: "Zapier exercise trigger hook not found",
      });
    }

    const response = await fetch(zapierSetupTriggerHook, {
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
  // Create exercise setup from public (Through Youtube to Zapier)
  createExerciseSetupFromYoutube: async (
    rawData: exerciseSetupZapierSchemaType,
  ) => {
    const parseYoutubeString = (youtubeString: string) => {
      const pairs = youtubeString.split("|");
      const result: Record<string, any> = {};

      // Parse the youtube description string into key-value pairs
      pairs.forEach((pair) => {
        const [key, value] = pair.split(":").map((item) => item.trim());
        if (key && value !== undefined) {
          result[key] = value;
        }
      });

      return result;
    };

    // Extract data from the youtube string
    const data = parseYoutubeString(rawData.youtube);

    // Helper function to convert string to array
    const toArray = (value: any): string[] => {
      if (!value) return [];
      if (typeof value === "string") {
        return value.includes(",")
          ? value
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
          : [value.trim()].filter((item) => item.length > 0);
      }
      return [];
    };

    // Get arrays for relations
    const equipments = toArray(data.equipments);
    const bodyParts = toArray(data.bodyParts);
    const racks = toArray(data.racks);

    // Create the exercise library video
    const result = await prisma.exerciseSetup.create({
      data: {
        title: data.title,
        videoUrl: rawData.embedUrl,
        height: parseFloat(data.height).toFixed(2),
        playUrl: rawData.playUrl,
        isPublic: true,
        publishedAt: rawData.publishedAt,
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
          create: bodyParts.map((bodyPartId) => ({
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

    return {
      success: true,
      message: "A video post has been created on library",
      data: result,
    };
  },
};
