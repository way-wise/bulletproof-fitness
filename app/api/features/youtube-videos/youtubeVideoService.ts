import {
  CreateYouTubeVideoData,
  UpdateYouTubeVideoData,
} from "@/lib/dataTypes";
import prisma from "@/lib/prisma";

export class YouTubeVideoService {
  // Create a new YouTube video
  static async createYouTubeVideo(data: CreateYouTubeVideoData) {
    try {
      const video = await prisma.youTubeVideo.create({
        data: {
          title: data.title,
          description: data.description,
          videoId: data.videoId,
          videoUrl: data.videoUrl,
          thumbnail: data.thumbnail,
          tags: data.tags || [],
          category: data.category || "General",
          privacy: data.privacy || "private",
          status: data.status || "uploaded",
          duration: data.duration,
          userId: data.userId,
          isPublic: data.isPublic || false,
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

      return { success: true, data: video };
    } catch (error) {
      console.error("Error creating YouTube video:", error);
      return { success: false, error: "Failed to create video" };
    }
  }

  // Get all YouTube videos with pagination and search
  static async getYouTubeVideos(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status) {
        where.status = status;
      }

      const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
          where,
          skip,
          take: limit,
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
        prisma.youTubeVideo.count({ where }),
      ]);

      return {
        success: true,
        data: {
          videos,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      return { success: false, error: "Failed to fetch videos" };
    }
  }

  // Get a single YouTube video by ID
  static async getYouTubeVideoById(id: string) {
    try {
      const video = await prisma.youTubeVideo.findUnique({
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
        return { success: false, error: "Video not found" };
      }

      return { success: true, data: video };
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      return { success: false, error: "Failed to fetch video" };
    }
  }

  // Get a single YouTube video by videoId
  static async getYouTubeVideoByVideoId(videoId: string) {
    try {
      const video = await prisma.youTubeVideo.findUnique({
        where: { videoId },
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
        return { success: false, error: "Video not found" };
      }

      return { success: true, data: video };
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      return { success: false, error: "Failed to fetch video" };
    }
  }

  // Update a YouTube video
  static async updateYouTubeVideo(id: string, data: UpdateYouTubeVideoData) {
    try {
      const video = await prisma.youTubeVideo.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          tags: data.tags,
          category: data.category,
          privacy: data.privacy,
          status: data.status,
          viewCount: data.viewCount,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          publishedAt: data.publishedAt,
          isPublic: data.isPublic,
          blocked: data.blocked,
          blockReason: data.blockReason,
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

      return { success: true, data: video };
    } catch (error) {
      console.error("Error updating YouTube video:", error);
      return { success: false, error: "Failed to update video" };
    }
  }

  // Delete a YouTube video
  static async deleteYouTubeVideo(id: string) {
    try {
      await prisma.youTubeVideo.delete({
        where: { id },
      });

      return { success: true, data: { message: "Video deleted successfully" } };
    } catch (error) {
      console.error("Error deleting YouTube video:", error);
      return { success: false, error: "Failed to delete video" };
    }
  }

  // Block a YouTube video
  static async blockYouTubeVideo(videoId: string, blockReason: string) {
    try {
      const video = await prisma.youTubeVideo.update({
        where: { videoId },
        data: {
          blocked: true,
          blockReason,
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

      return { success: true, data: video };
    } catch (error) {
      console.error("Error blocking YouTube video:", error);
      return { success: false, error: "Failed to block video" };
    }
  }

  // Unblock a YouTube video
  static async unblockYouTubeVideo(videoId: string) {
    try {
      const video = await prisma.youTubeVideo.update({
        where: { videoId },
        data: {
          blocked: false,
          blockReason: null,
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

      return { success: true, data: video };
    } catch (error) {
      console.error("Error unblocking YouTube video:", error);
      return { success: false, error: "Failed to unblock video" };
    }
  }

  // Update YouTube video status (publish/unpublish)
  static async updateYouTubeVideoStatus(
    videoId: string,
    isPublic?: boolean,
    blocked?: boolean,
    blockReason?: string,
  ) {
    try {
      const updateData: any = {};

      if (isPublic !== undefined) {
        updateData.isPublic = isPublic;
      }

      if (blocked !== undefined) {
        updateData.blocked = blocked;
        if (!blocked) {
          updateData.blockReason = null;
        }
      }

      if (blockReason !== undefined) {
        updateData.blockReason = blockReason;
      }

      const video = await prisma.youTubeVideo.update({
        where: { videoId },
        data: updateData,
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

      return { success: true, data: video };
    } catch (error) {
      console.error("Error updating YouTube video status:", error);
      return { success: false, error: "Failed to update video status" };
    }
  }

  // Get videos by user ID
  static async getVideosByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;

      const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
          where: { userId },
          skip,
          take: limit,
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
        prisma.youTubeVideo.count({ where: { userId } }),
      ]);

      return {
        success: true,
        data: {
          videos,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching user videos:", error);
      return { success: false, error: "Failed to fetch user videos" };
    }
  }

  // Search YouTube videos
  static async searchYouTubeVideos(
    query: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
        ],
      };

      const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
          where,
          skip,
          take: limit,
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
        prisma.youTubeVideo.count({ where }),
      ]);

      return {
        success: true,
        data: {
          videos,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error searching YouTube videos:", error);
      return { success: false, error: "Failed to search videos" };
    }
  }

  // Get public videos (for frontend display)
  static async getPublicVideos(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        isPublic: true,
        blocked: false,
      };

      const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
          where,
          skip,
          take: limit,
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
        prisma.youTubeVideo.count({ where }),
      ]);

      return {
        success: true,
        data: {
          videos,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching public videos:", error);
      return { success: false, error: "Failed to fetch public videos" };
    }
  }
}
