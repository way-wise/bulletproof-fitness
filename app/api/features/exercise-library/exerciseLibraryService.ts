import cloudinary from "@/app/api/lib/cloudinary";
import prisma from "@/lib/prisma";
import {
  exerciseLibrarySchema,
  exerciseLibrarySchemaAdmin,
} from "@/schema/exerciseLibrarySchema";
import { InferType } from "yup";

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

  createExerciseLibrary: async (
    data: InferType<typeof exerciseLibrarySchema> & { video: File },
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
      const created = await prisma.exerciseLibraryVideo.create({
        data: {
          title: data.title,
          equipment:
            data.equipment && data.equipment.length > 0
              ? JSON.stringify(data.equipment)
              : null,
          bodyPart:
            data.bodyPart && data.bodyPart.length > 0
              ? JSON.stringify(data.bodyPart)
              : null,
          height: data.height,
          rack:
            data.rack && data.rack.length > 0
              ? JSON.stringify(data.rack)
              : null,
          videoUrl: uploadResult.secure_url,
          userId: data.userId,
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
