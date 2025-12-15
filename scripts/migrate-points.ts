import { PrismaClient } from "@/prisma/generated/client";

const prisma = new PrismaClient();

async function migratePoints() {
  console.log("Starting point migration...");

  try {
    // Get all users with existing totalPoints
    const users = await prisma.users.findMany({
      where: {
        totalPoints: {
          gt: 0,
        },
      },
      select: {
        id: true,
        totalPoints: true,
      },
    });

    console.log(`Found ${users.length} users with points to migrate`);

    // Update each user: move totalPoints to availablePoints
    for (const user of users) {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          availablePoints: user.totalPoints,
          // Keep totalPoints for now for backward compatibility
        },
      });

      console.log(`Migrated ${user.totalPoints} points for user ${user.id}`);
    }

    console.log("Point migration completed successfully!");
  } catch (error) {
    console.error("Error during point migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
migratePoints()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

export default migratePoints;
