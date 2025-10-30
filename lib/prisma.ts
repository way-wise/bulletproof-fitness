import "@dotenvx/dotenvx/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Neon Connection
// import ws from "ws";
// neonConfig.webSocketConstructor = ws;

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const connectionString = process.env.DATABASE_URL as string;
// const adapter = new PrismaNeon({ connectionString });
// const prisma = global.prisma || new PrismaClient({ adapter });
// if (process.env.NODE_ENV === "development") global.prisma = prisma;
// export default prisma;

// Local Connection
const prisma = new PrismaClient();

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
