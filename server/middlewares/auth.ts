import { Context, Next } from "hono";

export async function requiresAuth(c: Context, next: Next) {
  const session = c.get("session");

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return next();
}
