import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";
import prisma from "../lib/prisma";
import { RewardType } from "./generated/enums";

async function main(total: number) {
  await prisma.$transaction(async (tx) => {
    // Create admin
    const users = [
      {
        name: "Bulletproof Fitness",
        email: "admin@gmail.com",
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await tx.users.createMany({
      data: users,
      skipDuplicates: true,
    });

    // Get created user IDs
    const userIds = await tx.users.findMany({
      select: { id: true },
      take: 1,
    });

    // Create accounts for users with same password
    const password = await hashPassword("12345678");
    await tx.accounts.createMany({
      data: userIds.map(({ id }) => ({
        userId: id,
        accountId: id,
        providerId: "credential",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    // Create rewards
    const rewards = [
      // VIEW reward removed - not used in this system (views tracked for stats only, no points awarded)
      {
        type: RewardType.LIKE,
        name: "Like",
        description: "Liked a video",
        points: 2,
        icon: "❤️",
        isActive: true,
      },
      {
        type: RewardType.RATING,
        name: "Rating",
        description: "Rated a video 5 stars",
        points: 1,
        icon: "⭐",
        isActive: true,
      },
      {
        type: RewardType.DISLIKE,
        name: "Dislike",
        description: "Disliked a video (deducts points)",
        points: 1, // This value is DECREMENTED from user's total
        icon: "👎",
        isActive: false, // Currently disabled in admin panel
      },
      {
        type: "UPLOAD_EXERCISE" as RewardType,
        name: "Upload Exercise",
        description: "Uploaded an exercise setup",
        points: 10,
        icon: "💪",
        isActive: true,
      },
      {
        type: "UPLOAD_LIBRARY" as RewardType,
        name: "Upload Library",
        description: "Uploaded a library video",
        points: 1,
        icon: "📚",
        isActive: true,
      },
      {
        type: "DEMO_CENTER" as RewardType,
        name: "Upload Demo Center",
        description: "Added a demo center",
        points: 10,
        icon: "🏢",
        isActive: true,
      },
    ];

    // Create rewards
    await tx.rewardPoints.createMany({
      data: rewards,
    });
  });
}

main(1)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
