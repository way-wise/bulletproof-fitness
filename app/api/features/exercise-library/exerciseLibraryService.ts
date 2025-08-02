import cloudinary from "@/app/api/lib/cloudinary";
import prisma from "@/lib/prisma";
import {
  exerciseLibrarySchema,
  exerciseLibrarySchemaAdmin,
} from "@/schema/exerciseLibrarySchema";
import { InferType } from "yup";

const zapExerciseTriggerHook = process.env.ZAPIER_EXERCISE_TRIGGER_HOOK;

export const exerciseLibraryService = {
  createExerciseLibraryAdmin: async (
    data: InferType<typeof exerciseLibrarySchemaAdmin>,
  ) => {
    console.log(data);
    const bodyPart = await prisma.exerciseLibraryVideo.create({
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return bodyPart;
  },

  // Get all exercise library videos for dashboard (admin)
  getAllExerciseLibraryVideos: async (page = 1, limit = 10, search = "") => {
    try {
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where = search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { equipment: { contains: search, mode: "insensitive" as const } },
              { bodyPart: { contains: search, mode: "insensitive" as const } },
              { rack: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.exerciseLibraryVideo.count({ where });

      // Get paginated data
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
        },
      });

      if (!exercise) {
        throw new Error("Exercise library video not found");
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
      const exercise = await prisma.exerciseLibraryVideo.update({
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

  // Create exercise library video (From Members)
  createExerciseLibrary: async (formData: FormData) => {
    try {
      if (!zapExerciseTriggerHook) {
        throw new Error("Zapier webhook URL not found");
      }
      // Trigger zap webhook with data
      const zapierResponse = await fetch(zapExerciseTriggerHook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      });

      if (!zapierResponse.ok) {
        const errorText = await zapierResponse.text();
        console.error("Zapier webhook call failed:", errorText);
        throw new Error(`Zapier webhook call failed: ${errorText}`);
      }

      const zapierResult = await zapierResponse.json();
      const youtubeUrl = zapierResult.youtubeUrl;

      console.log(zapierResult);
    } catch (error) {
      throw new Error("Failed to save exercise library data.");
    }
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
    bodyPart?: string;
    equipment?: string;
    rack?: string;
    username?: string;
    minHeight?: number;
    maxHeight?: number;
    rating?: number;
    sortBy?: "title" | "createdAt" | "views" | "likes";
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        bodyPart = "",
        equipment = "",
        rack = "",
        username = "",
        minHeight = 0,
        maxHeight = 85,
        rating = 0,
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
      if (bodyPart) {
        where.bodyPart = { contains: bodyPart, mode: "insensitive" as const };
      }

      // Equipment filter
      if (equipment) {
        where.equipment = { contains: equipment, mode: "insensitive" as const };
      }

      // Rack filter
      if (rack) {
        where.rack = { contains: rack, mode: "insensitive" as const };
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
      const total = await prisma.exerciseLibraryVideo.count({
        where,
      });

      // Get paginated data with user info
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

          return {
            ...exercise,
            equipment: parsedEquipment,
            bodyPart: parsedBodyPart,
            rack: parsedRack,
            heightInInches,
            // Mock data for demo (replace with real data when available)
            views: Math.floor(Math.random() * 1000) + 100,
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 10),
            saves: Math.floor(Math.random() * 20),
            rating: (Math.random() * 5).toFixed(1),
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
