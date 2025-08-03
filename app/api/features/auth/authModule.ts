import { Hono } from "hono";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const app = new Hono();

app.get("/verify-email", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.text("Invalid token", 400);
  }
  const record = await prisma.verifications.findFirst({
    where: {
      identifier: token,
    },
  });

  if (!record) {
    return c.text("Invalid token", 400);
  }

  if (record.expiresAt < new Date()) {
    return c.text("Token expired", 400);
  }

  await prisma.users.update({
    where: {
      email: record.identifier,
    },
    data: {
      emailVerified: true,
    },
  });

  await prisma.verifications.delete({
    where: {
      id: record.id,
    },
  });

  return c.text("Email verified successfully", 200);
});

app.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export default app;
