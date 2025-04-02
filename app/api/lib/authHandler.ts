import { Context, Next } from "hono";
import { getSession } from "@/lib/getSession";

export const requiresAuth = async (c: Context, next: Next) => {
  const session = await getSession();

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return next();
};
