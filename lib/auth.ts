import { headers } from "next/headers";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "./email";
import { emailEvents, EmailEventType } from "@/app/api/lib/events/email_event";

// Auth Config
export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "users",
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      emailEvents.emit(EmailEventType.VERIFY_EMAIL, {
        email: user.email,
        token,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour,
  },
  plugins: [admin()],
});

// Get the current user session from request headers
export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};
