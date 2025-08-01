import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { exerciseLibraryVideoSchema } from "@/schema/exerciseLibraryVideo";
import { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const exerciseLibraryVideoService = {
  // Get all exercise library videos
  getExerciseLibraryVideos: async (
    query: PaginationQuery & { search?: string },
  ) => {
    const session = await getSession();
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { skip, take, page, limit } = getPaginationQuery(query);

    // Build search filter
    const searchFilter = {
      // Exclude videos where isPublic is false AND blocked is true
      NOT: {
        isPublic: false,
        blocked: true,
      },
      ...(query.search
        ? {
            OR: [
              {
                title: { contains: query.search, mode: "insensitive" as const },
              },
              {
                equipment: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                bodyPart: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                rack: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [videos, total] = await prisma.$transaction([
      prisma.exerciseLibraryVideo.findMany({
        where: searchFilter,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.exerciseLibraryVideo.count({ where: searchFilter }),
    ]);

    return {
      data: videos,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  // Create new exercise library video
  createExerciseLibraryVideo: async (
    data: InferType<typeof exerciseLibraryVideoSchema>,
  ) => {
    const session = await getSession();
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const video = await prisma.exerciseLibraryVideo.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        equipment: data.equipment,
        bodyPart: data.bodyPart,
        height: data.height,
        rack: data.rack,
        userId: session.user.id,
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

    return video;
  },

  // Get exercise library video by id
  getExerciseLibraryVideo: async (id: string) => {
    const session = await getSession();
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const video = await prisma.exerciseLibraryVideo.findUnique({
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

    if (!video) {
      throw new HTTPException(404, { message: "Video not found" });
    }

    return video;
  },

  // Delete exercise library video
  deleteExerciseLibraryVideo: async (id: string) => {
    const session = await getSession();
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const video = await prisma.exerciseLibraryVideo.findUnique({
      where: { id },
    });

    if (!video) {
      throw new HTTPException(404, { message: "Video not found" });
    }

    // Check if user owns the video or is admin
    if (video.userId !== session.user.id && session.user.role !== "admin") {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    await prisma.exerciseLibraryVideo.delete({
      where: { id },
    });

    return { message: "Video deleted successfully" };
  },
};
