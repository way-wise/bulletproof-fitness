import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 100 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await prisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Seeded users successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
