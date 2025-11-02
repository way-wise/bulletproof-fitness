import { emailEvents, EmailEventType } from "@/app/api/lib/events/email_event";
import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";

// Auth Config
export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "https://bulletproof.waywisetech.com",
  ],
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      emailEvents.emit(EmailEventType.PASSWORD_RESET_EMAIL, {
        email: user.email,
        url,
        token,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      emailEvents.emit(EmailEventType.VERIFY_EMAIL, {
        email: user.email,
        url,
        token,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour,
  },
  plugins: [
    admin({
      adminRoles: ["super"],
      defaultRole: "user",
    }),
  ],
});

// Get the current user session from request headers
export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};
