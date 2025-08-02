import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";
import prisma from "../lib/prisma";

async function main(total: number) {
  await prisma.$transaction(async (tx) => {
    // Create users
    const users = Array.from({ length: total }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      emailVerified: false,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await tx.users.createMany({
      data: users,
      skipDuplicates: true,
    });

    // Get created user IDs
    const userIds = await tx.users.findMany({
      select: { id: true },
      take: total,
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
