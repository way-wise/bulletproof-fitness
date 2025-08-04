import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ReactionType, RewardType } from "@/prisma/generated/enums";

async function getRewardPointValue(type: RewardType) {
  const reward = await prisma.rewardPoints.findFirst({
    where: { type },
    orderBy: { createdAt: "desc" },
  });
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

export const actionService = {
  async giveReaction(
    contentId: string,
    key: "setup" | "lib",
    type: ReactionType,
  ) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    const userId = session.user.id;

    console.log("contentId", contentId, "key", key, "type", type);

    const isLibrary = key === "lib";

    const content = await (isLibrary
      ? prisma.exerciseLibraryVideo.findUnique({ where: { id: contentId } })
      : prisma.exerciseSetup.findUnique({ where: { id: contentId } }));
    if (!content) throw new Error("Content not found");

    const whereClause = isLibrary
      ? { userId, libraryId: contentId }
      : { userId, exerciseId: contentId };

    const existingReaction = await prisma.userReaction.findFirst({
      where: whereClause,
    });

    if (existingReaction) {
      throw new Error("You have already reacted with this type");

      //   await prisma.userReaction.update({
      //     where: { id: existingReaction.id },
      //     data: { reaction: type },
      //   });
      //   await awardPointsToUser(
      //     userId,
      //     type === "LIKE" ? RewardType.LIKE : RewardType.DISLIKE,
      //     "Reaction Update",
      //     `User updated reaction to ${type}`,
      //   );
      // } else {
      //   await prisma.userReaction.create({
      //     data: {
      //       userId,
      //       reaction: type,
      //       ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
      //     },
      //   });

      // console.log("Updating existing reaction", {
      //   userId,
      //   reaction: type,
      //   ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
      // });
    }

    const statsField = type === "LIKE" ? "totalLikes" : "totalDislikes";
    const contentStats = await prisma.contentStats.findFirst({
      where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
    });

    await prisma.contentStats.upsert({
      where: { id: contentStats?.id ?? "__new" },
      update: { [statsField]: { increment: 1 } },
      create: {
        id: crypto.randomUUID(),
        ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        [statsField]: 1,
      },
    });
    await awardPointsToUser(
      userId,
      RewardType.LIKE,
      "Reaction",
      `User reacted with ${type}`,
    );
  },

  async giveRating(contentId: string, key: "setup" | "lib", rating: number) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;
    if (rating < 1 || rating > 5)
      throw new Error("Rating must be between 1 and 5");

    const isLibrary = key === "lib";

    console.log("contentId", contentId, "key", key, "rating", rating);
    const contentExists = isLibrary
      ? await prisma.exerciseLibraryVideo.findUnique({
          where: { id: contentId },
        })
      : await prisma.exerciseSetup.findUnique({ where: { id: contentId } });

    if (!contentExists) throw new Error("Content not found");

    const whereClause = isLibrary
      ? { userId, libraryId: contentId }
      : { userId, exerciseId: contentId };

    const existingRating = await prisma.userRating.findFirst({
      where: whereClause,
    });

    if (existingRating) {
      await prisma.userRating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      const ratingRecord = await prisma.userRating.create({
        data: {
          userId,
          rating,
          ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        },
      });

      if (!ratingRecord) throw new Error("Failed to create rating record");

      await awardPointsToUser(
        userId,
        RewardType.RATING,
        "Rating",
        `Rated content ${rating} stars`,
      );
    }

    const ratings = await prisma.userRating.findMany({
      where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
    });

    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    const contentStats = await prisma.contentStats.findFirst({
      where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
    });

    if (contentStats) {
      await prisma.contentStats.update({
        where: { id: contentStats.id },
        data: { avgRating: avg },
      });
    } else {
      await prisma.contentStats.create({
        data: {
          id: crypto.randomUUID(),
          ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
          avgRating: avg,
        },
      });
    }
  },

  async recordView(contentId: string, key: "setup" | "lib") {
    const session = await getSession();
    const userId = session?.user.id;
    const isLibrary = key === "lib";

    await prisma.userView.create({
      data: {
        ...(userId ? { userId } : {}),
        ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        sessionId: session?.session.id,
      },
    });

    if (userId) {
      await awardPointsToUser(
        userId,
        RewardType.VIEW,
        "View",
        "Viewed content",
      );
    }

    const contentStats = await prisma.contentStats.findFirst({
      where: isLibrary ? { libraryId: contentId } : { exerciseId: contentId },
    });

    await prisma.contentStats.upsert({
      where: { id: contentStats?.id ?? "__new" },
      update: { totalViews: { increment: 1 } },
      create: {
        id: crypto.randomUUID(),
        ...(isLibrary ? { libraryId: contentId } : { exerciseId: contentId }),
        totalViews: 1,
      },
    });
  },
};
