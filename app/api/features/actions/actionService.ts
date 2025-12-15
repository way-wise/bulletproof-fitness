import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ReactionType, RewardType } from "@/prisma/generated/client";
import { PaginationQuery } from "@/schema/paginationSchema";
import { getPaginationQuery } from "../../lib/pagination";
import { pointTrackingService } from "../points/pointTrackingService";

async function getRewardPointValue(type: RewardType) {
  const reward = await prisma.rewardPoints.findFirst({
    where: { type },
    orderBy: { createdAt: "desc" },
  });
  if (!reward) {
    console.warn(`No reward points found for type: ${type}`);
    return 0;
  }
  if (!reward.isActive) {
    console.warn(`Reward points for type ${type} are not active`);
    return 0;
  }
  return reward?.points ?? 0;
}

export async function awardPointsToUser(
  userId: string,
  type: RewardType,
  name: string,
  description: string,
  referenceId?: string,
  autoApprove: boolean = false,
) {
  const points = await getRewardPointValue(type);

  if (!points) return;

  // Use new point tracking system
  await pointTrackingService.createTransaction({
    userId,
    actionType: type,
    referenceId,
    points,
    description,
    status: autoApprove ? "approved" : "pending",
  });
}
export async function decrementPointsFromUser(
  userId: string,
  type: RewardType,
  name: string,
  description: string,
  referenceId?: string,
) {
  const points = await getRewardPointValue(type);

  if (!points) return;

  // Use new point tracking system for negative points (auto-approved)
  await pointTrackingService.createTransaction({
    userId,
    actionType: type,
    referenceId,
    points: -points, // Negative points for deduction
    description,
    status: "approved", // Auto-approve deductions
  });
}

export const actionService = {
  async giveReaction(
    contentId: string,
    key: "setup" | "lib",
    type: ReactionType,
  ) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;
    const isLibrary = key === "lib";

    // Step 1: Validate content exists
    const content = await (isLibrary
      ? prisma.exerciseLibraryVideo.findUnique({ where: { id: contentId } })
      : prisma.exerciseSetup.findUnique({ where: { id: contentId } }));

    if (!content) throw new Error("Content not found");

    // Step 2: Find existing reaction
    const whereClause = isLibrary
      ? { userId_libraryId: { userId, libraryId: contentId } }
      : { userId_exerciseId: { userId, exerciseId: contentId } };

    const existingReaction = await prisma.userReaction.findUnique({
      where: whereClause,
    });

    const result = await prisma.$transaction(async (tx) => {
      let stats = await tx.contentStats.findFirst({
        where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
      });

      const updateStats = async (
        field: "totalLikes" | "totalDislikes",
        increment: boolean,
      ) => {
        if (stats) {
          const current = stats[field] ?? 0;
          if (!increment && current <= 0) return;
          stats = await tx.contentStats.update({
            where: { id: stats.id },
            data: {
              [field]: {
                [increment ? "increment" : "decrement"]: 1,
              },
            },
          });
        } else if (increment) {
          stats = await tx.contentStats.create({
            data: {
              id: crypto.randomUUID(),
              ...(isLibrary
                ? { libraryId: contentId }
                : { exerciseId: contentId }),
              [field]: 1,
            },
          });
        }
      };

      if (existingReaction) {
        if (existingReaction.reaction === type) {
          // Same reaction → remove it
          await tx.userReaction.delete({ where: { id: existingReaction.id } });
          const field = type === "LIKE" ? "totalLikes" : "totalDislikes";
          await updateStats(field, false);

          await decrementPointsFromUser(
            userId,
            type === "LIKE" ? RewardType.LIKE : RewardType.DISLIKE,
            "Reaction",
            `User removed ${type}`,
          );

          return { message: "Reaction removed", stats };
        } else {
          // Switching reaction
          const oldField =
            existingReaction.reaction === "LIKE"
              ? "totalLikes"
              : "totalDislikes";
          const newField = type === "LIKE" ? "totalLikes" : "totalDislikes";

          await tx.userReaction.update({
            where: { id: existingReaction.id },
            data: { reaction: type },
          });

          await updateStats(oldField, false);
          await updateStats(newField, true);

          // Adjust points: remove old, add new
          await decrementPointsFromUser(
            userId,
            existingReaction.reaction === "LIKE"
              ? RewardType.LIKE
              : RewardType.DISLIKE,
            "Reaction",
            `User switched from ${existingReaction.reaction}`,
            contentId, // reference ID
          );

          await awardPointsToUser(
            userId,
            type === "LIKE" ? RewardType.LIKE : RewardType.DISLIKE,
            "Reaction",
            `User switched to ${type}`,
            contentId, // reference ID
            true, // auto-approve reactions
          );

          return { message: "Reaction switched", stats };
        }
      }

      // New reaction
      await tx.userReaction.create({
        data: {
          userId,
          reaction: type,
          ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        },
      });

      await updateStats(type === "LIKE" ? "totalLikes" : "totalDislikes", true);

      // Award or deduct points
      if (type === "LIKE") {
        await awardPointsToUser(
          userId,
          RewardType.LIKE,
          "Reaction",
          "User liked",
          contentId, // reference ID
          true, // auto-approve likes
        );
      } else {
        await decrementPointsFromUser(
          userId,
          RewardType.DISLIKE,
          "Reaction",
          "User disliked",
          contentId, // reference ID
        );
      }

      return { message: "Reaction added", stats };
    });

    return result;
  },

  async giveRating(contentId: string, key: "setup" | "lib", rating: number) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const isLibrary = key === "lib";

    // Step 1: Ensure content exists
    const content = await (isLibrary
      ? prisma.exerciseLibraryVideo.findUnique({ where: { id: contentId } })
      : prisma.exerciseSetup.findUnique({ where: { id: contentId } }));

    if (!content) throw new Error("Content not found");

    // Step 2: Transaction block
    const result = await prisma.$transaction(async (tx) => {
      // Find or update/create user rating
      const existingRating = await tx.userRating.findFirst({
        where: isLibrary
          ? { userId, libraryId: contentId }
          : { userId, exerciseId: contentId },
      });

      if (existingRating) {
        await tx.userRating.update({
          where: { id: existingRating.id },
          data: { rating },
        });
      } else {
        await tx.userRating.create({
          data: {
            userId,
            rating,
            ...(isLibrary
              ? { libraryId: contentId }
              : { exerciseId: contentId }),
          },
        });

        // Only award points on first rating if rating is 5
        if (rating == 5) {
          await awardPointsToUser(
            userId,
            RewardType.RATING,
            "Rating",
            `Rated content ${rating} stars`,
            contentId, // reference ID
            true, // auto-approve ratings
          );
        }
      }

      // Step 3: Get all ratings for this content
      const allRatings = await tx.userRating.findMany({
        where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
      });

      const avgRating =
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      // Step 4: Update or create content stats with avgRating
      const contentStats = await tx.contentStats.findFirst({
        where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
      });

      if (contentStats) {
        await tx.contentStats.update({
          where: { id: contentStats.id },
          data: { avgRating },
        });
      } else {
        await tx.contentStats.create({
          data: {
            id: crypto.randomUUID(),
            ...(isLibrary
              ? { libraryId: contentId }
              : { exerciseId: contentId }),
            avgRating,
          },
        });
      }

      return avgRating;
    });

    return { message: "Rating submitted", avgRating: result };
  },
  async recordView(contentId: string, key: "setup" | "lib") {
    const session = await getSession();
    const userId = session?.user.id;
    const sessionId = session?.session.id;
    const isLibrary = key === "lib";

    // Ensure content exists (optional safety, comment out if already validated externally)
    const contentExists = await (isLibrary
      ? prisma.exerciseLibraryVideo.findUnique({ where: { id: contentId } })
      : prisma.exerciseSetup.findUnique({ where: { id: contentId } }));

    if (!contentExists) throw new Error("Content not found");

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Record user view
      await tx.userView.create({
        data: {
          ...(userId ? { userId } : {}),
          ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
          sessionId,
        },
      });

      // 2. Award view points only for logged-in users
      if (userId) {
        await awardPointsToUser(
          userId,
          RewardType.VIEW,
          "View",
          "Viewed content",
        );
      }

      // 3. Update or create contentStats
      const existingStats = await tx.contentStats.findFirst({
        where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
      });

      if (existingStats) {
        await tx.contentStats.update({
          where: { id: existingStats.id },
          data: { totalViews: { increment: 1 } },
        });
      } else {
        await tx.contentStats.create({
          data: {
            id: crypto.randomUUID(),
            ...(isLibrary
              ? { libraryId: contentId }
              : { exerciseId: contentId }),
            totalViews: 1,
          },
        });
      }
    });
  },

  async recordFeedback(
    fullName: string,
    email: string,
    phone: string,
    message: string,
  ) {
    // Create feedback entry
    await prisma.feedback.create({
      data: {
        fullName,
        email,
        phone,
        message,
      },
    });

    return {
      success: true,
      message: "Feedback recorded",
    };
  },

  async getFeedback(query: PaginationQuery & { search?: string }) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const { page, limit, skip, take } = getPaginationQuery(query);
    const { search = "" } = query;

    const searchFilter = search
      ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
          { message: { contains: search, mode: "insensitive" as const } },
        ],
      }
      : {};

    const [feedbacks, total] = await prisma.$transaction([
      prisma.feedback.findMany({
        where: searchFilter,
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.feedback.count({ where: searchFilter }),
    ]);

    return {
      success: true,
      data: feedbacks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
