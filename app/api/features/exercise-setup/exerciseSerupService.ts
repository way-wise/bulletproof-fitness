import cloudinary from "@/app/api/lib/cloudinary";
import prisma from "@/lib/prisma";
import {
  exerciseSetupSchema,
  exerciseSetupSchemaAdmin,
} from "@/schema/exerciseSetupSchema";
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

  // Block exercise library video
  blockExerciseLibraryVideo: async (id: string, blockReason: string) => {
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

  // Unblock exercise library video
  unblockExerciseLibraryVideo: async (id: string) => {
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

  createExerciseLibrary: async (
    data: InferType<typeof exerciseSetupSchema> & { video: File },
  ) => {
    try {
      // Check Cloudinary environment variables
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.error("Missing Cloudinary environment variables");
        throw new Error("Cloudinary configuration is missing");
      }

      console.log("Starting video upload process...");
      console.log("Video file info:", {
        name: data.video.name,
        size: data.video.size,
        type: data.video.type,
      });

      // Convert File to base64 Data URI
      const buffer = await data.video.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataURI = `data:${data.video.type};base64,${base64}`;

      console.log("Uploading to Cloudinary...");
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        resource_type: "video",
        folder: "exercise-library",
      });

      console.log("Cloudinary upload successful:", uploadResult.secure_url);

      // Save to Prisma DB
      const created = await prisma.exerciseSetup.create({
        data: {
          title: data.title,
          equipment: data.equipment,
          bodyPart: data.bodyPart,
          height: data.height,
          rack: data.rack,
          videoUrl: uploadResult.secure_url,
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
        },
      });

      console.log("Database save successful:", created.id);

      // 🔥 Trigger Zapier webhook (optional via env flag)
      if (created?.id && process.env.ZAPIER_WEBHOOK_URL) {
        console.log("Sending data to Zapier...,created", created);
        try {
          const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Basic exercise info
              title: created.title,
              description: `Exercise using ${created.equipment} for ${created.bodyPart}`,
              videoUrl: created.videoUrl,
              id: created.id,

              // Additional metadata for Zapier
              equipment: created.equipment,
              bodyPart: created.bodyPart,
              height: created.height,
              rack: created.rack,
              userId: created.userId,
              createdAt: created.createdAt,
              updatedAt: created.updatedAt,

              // Zapier-specific fields
              event_type: "exercise_library_created",
              source: "bulletproof_fitness_app",
            }),
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          if (!zapierResponse.ok) {
            console.warn(
              `Zapier webhook failed with status: ${zapierResponse.status}`,
            );
          } else {
            console.log("Zapier webhook sent successfully.");
          }
        } catch (zapierError) {
          console.error("Zapier webhook error:", zapierError);
          // Don't fail the main operation if Zapier fails
        }
      } else {
        console.warn("Zapier webhook URL not set. Skipping...");
      }

      return created;
    } catch (error) {
      console.error("Upload or DB save error:", error);
      throw new Error("Failed to upload and save exercise library data.");
    }
  },

  // Get exercise library data for a user (public access)
  getExerciseLibrary: async (userId: string) => {
    try {
      const exercises = await prisma.exerciseSetup.findMany({
        where: {
          userId: userId,
          isPublic: true,
          blocked: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          videoUrl: true,
          equipment: true,
          bodyPart: true,
          height: true,
          rack: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return exercises;
    } catch (error) {
      console.error("Error fetching exercise library:", error);
      throw new Error("Failed to fetch exercise library data.");
    }
  },
};
