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
        equipment: data.equipment,
        bodyPart: data.bodyPart,
        height: data.height || null,
        rack: data.rack || null,
        userId: data.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return bodyPart;
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
          equipment: data.equipment,
          bodyPart: data.bodyPart,
          height: data.height,
          rack: data.rack,
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

  // Get exercise library data for a user
  getExerciseLibrary: async (userId: string) => {
    try {
      const exercises = await prisma.exerciseLibraryVideo.findMany({
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
