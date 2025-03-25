import { Context, Next } from "hono";
import { auth } from "@server/lib/auth";

// Auth init
export const initAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};

// Prevent Unauthorized Request
export const requiresAuth = (c: Context, next: Next) => {
  const session = c.get("session");

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return next();
};
