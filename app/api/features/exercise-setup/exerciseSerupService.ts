import prisma from "@/lib/prisma";
import { exerciseSetupSchemaAdmin } from "@/schema/exerciseSetupSchema";
import { InferType } from "yup";

export const exerciseSetupService = {
  createExerciseSetupAdmin: async (
    data: InferType<typeof exerciseSetupSchemaAdmin>,
  ) => {
    console.log(data);
    const bodyPart = await prisma.exerciseSetup.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        equipment:
          data.equipment && data.equipment.length > 0
            ? JSON.stringify(data.equipment)
            : null,
        bodyPart:
          data.bodyPart && data.bodyPart.length > 0
            ? JSON.stringify(data.bodyPart)
            : null,
        height: data.height && data.height.trim() !== "" ? data.height : null,
        rack:
          data.rack && data.rack.length > 0 ? JSON.stringify(data.rack) : null,
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
      },
    });

    return bodyPart;
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
              { equipment: { contains: search } },
              { bodyPart: { contains: search } },
              { rack: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.exerciseSetup.count({ where });

      // Get paginated data with user relation
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
      console.error("Error fetching all exercise library videos:", error);
      throw new Error("Failed to fetch exercise library videos.");
    }
  },

  // Get single exercise library video by ID
  getExerciseSetupVideoById: async (id: string) => {
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
        },
      });

      console.log("Database query result:", exercise);

      if (!exercise) {
        console.log("No exercise setup found with id:", id);
        throw new Error("Exercise setup video not found");
      }

      return exercise;
    } catch (error) {
      console.error("Error fetching exercise setup video:", error);
      throw new Error("Failed to fetch exercise setup video.");
    }
  },

  // Update exercise library video
  updateExerciseLibraryVideo: async (
    id: string,
    data: InferType<typeof exerciseSetupSchemaAdmin>,
  ) => {
    try {
      const exercise = await prisma.exerciseSetup.update({
        where: { id },
        data: {
          title: data.title,
          videoUrl: data.videoUrl,
          equipment:
            data.equipment && data.equipment.length > 0
              ? JSON.stringify(data.equipment)
              : null,
          bodyPart:
            data.bodyPart && data.bodyPart.length > 0
              ? JSON.stringify(data.bodyPart)
              : null,
          height: data.height && data.height.trim() !== "" ? data.height : null,
          rack:
            data.rack && data.rack.length > 0
              ? JSON.stringify(data.rack)
              : null,
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

  // Get exercise setup videos public
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
      };

      // Search filter
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" as const } },
          { equipment: { contains: search, mode: "insensitive" as const } },
          { bodyPart: { contains: search, mode: "insensitive" as const } },
          { rack: { contains: search, mode: "insensitive" as const } },
        ];
      }

      // Body part filter
      if (bodyPartIds.length > 0) {
        where.OR = bodyPartIds.map((id) => ({
          bodyPart: { contains: id, mode: "insensitive" as const },
        }));
      }

      // Equipment filter
      if (equipmentIds.length > 0) {
        where.OR = equipmentIds.map((id) => ({
          equipment: { contains: id, mode: "insensitive" as const },
        }));
      }

      // Rack filter
      if (rackIds.length > 0) {
        where.OR = rackIds.map((id) => ({
          rack: { contains: id, mode: "insensitive" as const },
        }));
      }

      // Username filter
      if (username) {
        where.user = {
          name: { contains: username, mode: "insensitive" as const },
        };
      }

      // Height filter
      if (minHeight > 0 || maxHeight < 85) {
        where.AND = [{ height: { not: null } }, { height: { not: "" } }];
      }

      // Get total count
      const total = await prisma.exerciseSetup.count({
        where,
      });

      // Get paginated data with user info
      const exercises = await prisma.exerciseSetup.findMany({
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
        },
      });

      // Transform data to include parsed JSON and additional fields
      const transformedExercises = exercises
        .map((exercise) => {
          const parsedEquipment = exercise.equipment
            ? JSON.parse(exercise.equipment)
            : [];
          const parsedBodyPart = exercise.bodyPart
            ? JSON.parse(exercise.bodyPart)
            : [];
          const parsedRack = exercise.rack ? JSON.parse(exercise.rack) : [];

          // Calculate height in inches if it exists
          let heightInInches = null;
          if (exercise.height) {
            const heightMatch = exercise.height.match(/(\d+(?:\.\d+)?)/);
            if (heightMatch) {
              heightInInches = parseFloat(heightMatch[1]);
            }
          }

          // Apply height filter after parsing
          if ((minHeight > 0 || maxHeight < 85) && heightInInches !== null) {
            if (heightInInches < minHeight || heightInInches > maxHeight) {
              return null;
            }
          }

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
              id: parsedEquipment[0]?.id || "default",
              name: parsedEquipment[0]?.name || "Unknown Equipment",
            },
            bodyPart: {
              id: parsedBodyPart[0]?.id || "default",
              name: parsedBodyPart[0]?.name || "Unknown Body Part",
            },
            rack: parsedRack[0]
              ? {
                  id: parsedRack[0]?.id || "default",
                  name: parsedRack[0]?.name || "Unknown Rack",
                }
              : undefined,
            height: heightInInches || 0,
            userId: exercise.userId,
            user: exercise.user,
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
};
