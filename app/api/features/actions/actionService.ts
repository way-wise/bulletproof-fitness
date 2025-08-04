import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ReactionType, RewardType } from "@/prisma/generated/enums";

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

async function awardPointsToUser(
  userId: string,
  type: RewardType,
  name: string,
  description: string,
) {
  const points = await getRewardPointValue(type);

  if (!points) return;

  await prisma.rewardPoints.create({
    data: {
      userId,
      points,
      type,
      name,
      description,
      isActive: true,
    },
  });

  console.log("Awarding points", {
    userId,
    points,
  });

  await prisma.users.update({
    where: { id: userId },
    data: {
      totalPoints: {
        increment: points,
      },
    },
  });
}
async function decrementPointsFromUser(
  userId: string,
  type: RewardType,
  name: string,
  description: string,
) {
  const points = await getRewardPointValue(type);

  if (!points) return;

  await prisma.rewardPoints.create({
    data: {
      userId,
      points: -points,
      type,
      name,
      description,
      isActive: true,
    },
  });

  console.log("Decrementing points", {
    userId,
    points: -points,
  });

  await prisma.users.update({
    where: { id: userId },
    data: {
      totalPoints: {
        decrement: points,
      },
    },
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

    // Step 1: Verify content exists
    const content = await (isLibrary
      ? prisma.exerciseLibraryVideo.findUnique({ where: { id: contentId } })
      : prisma.exerciseSetup.findUnique({ where: { id: contentId } }));

    if (!content) throw new Error("Content not found");

    // Step 2: Get existing reaction
    const whereClause = isLibrary
      ? { userId_libraryId: { userId, libraryId: contentId } }
      : { userId_exerciseId: { userId, exerciseId: contentId } };

    const existingReaction = await prisma.userReaction.findUnique({
      where: whereClause,
    });

    const statsField = type === "LIKE" ? "totalLikes" : "totalDislikes";

    // Step 3: Start transaction
    const result = await prisma.$transaction(async (tx) => {
      let contentStats = await tx.contentStats.findFirst({
        where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
      });

      const updateStats = async (
        field: "totalLikes" | "totalDislikes",
        increment: boolean,
      ) => {
        if (contentStats) {
          contentStats = await tx.contentStats.update({
            where: { id: contentStats.id },
            data: { [field]: { [increment ? "increment" : "decrement"]: 1 } },
          });
        } else if (increment) {
          contentStats = await tx.contentStats.create({
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
          // Remove reaction
          await tx.userReaction.delete({ where: { id: existingReaction.id } });
          await updateStats(statsField, false);
          // Step 4: Award points dcrement
          await decrementPointsFromUser(
            userId,
            type === "LIKE" ? RewardType.LIKE : RewardType.DISLIKE,
            "Reaction",
            `User removed reaction ${type}`,
          );
          return { message: "Reaction removed", stats: contentStats };
        } else {
          // Switch reaction
          const oldField =
            existingReaction.reaction === "LIKE"
              ? "totalLikes"
              : "totalDislikes";
          await tx.userReaction.update({
            where: { id: existingReaction.id },
            data: { reaction: type },
          });
          await updateStats(oldField, false);
          await updateStats(statsField, true);
          return { message: "Reaction updated", stats: contentStats };
        }
      }

      // No reaction exists — create it
      await tx.userReaction.create({
        data: {
          userId,
          reaction: type,
          ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        },
      });

      await updateStats(statsField, true);

      return { message: "Reaction added", stats: contentStats };
    });

    // Step 4: Award points (outside transaction if safe)
    await awardPointsToUser(
      userId,
      RewardType.LIKE,
      "Reaction",
      `User reacted with ${type}`,
    );

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

        // Only award points on first rating
        await awardPointsToUser(
          userId,
          RewardType.RATING,
          "Rating",
          `Rated content ${rating} stars`,
        );
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
};
