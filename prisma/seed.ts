import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";
import prisma from "../lib/prisma";
import { RewardType } from "./generated/enums";

async function main(total: number) {
  await prisma.$transaction(async (tx) => {
    // Create users
    // const users = Array.from({ length: total }).map(() => ({
    //   name: faker.person.fullName(),
    //   email: faker.internet.email().toLowerCase(),
    //   emailVerified: false,
    //   role: "user",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }));

    // const users = [
    //   {
    //     name: "Admin User",
    //     email: "admin@gmail.com",
    //     emailVerified: true,
    //     role: "admin",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // await tx.users.createMany({
    //   data: users,
    //   skipDuplicates: true,
    // });

    // Get created user IDs
    // const userIds = await tx.users.findMany({
    //   select: { id: true },
    //   take: total,
    // });

    // Create accounts for users with same password
    // const password = await hashPassword("12345678");
    // await tx.accounts.createMany({
    //   data: userIds.map(({ id }) => ({
    //     userId: id,
    //     accountId: id,
    //     providerId: "credential",
    //     password,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   })),
    // });

    // Create rewards
    const rewards = [
      {
        type: RewardType.LIKE,
        name: "Like",
        points: 1,
        isActive: true,
      },

      {
        type: RewardType.RATING,
        name: "Rating",
        points: 1,
        isActive: true,
      },

      {
        type: RewardType.DISLIKE,
        name: "Dislike",
        points: 1,
        isActive: true,
      },
      {
        type: RewardType.UPLOAD_EXERCISE,
        name: "Upload Exercise",
        points: 10,
        isActive: true,
      },
      {
        type: RewardType.UPLOAD_LIBRARY,
        name: "Upload Library",
        points: 10,
        isActive: true,
      },
    ];

    // Create rewards
    await tx.rewardPoints.createMany({
      data: rewards,
    });
  });
}

main(100)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
