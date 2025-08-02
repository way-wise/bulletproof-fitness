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

  // Get exercise setup videos for a specific user
  getExerciseSetup: async (userId: string) => {
    try {
      const exercises = await prisma.exerciseSetup.findMany({
        where: { userId },
        orderBy: {
          createdAt: "desc",
        },
      });

      return exercises;
    } catch (error) {
      console.error("Error fetching exercise setup videos:", error);
      throw new Error("Failed to fetch exercise setup videos.");
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
};
