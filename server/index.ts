import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@server/lib/auth";
import authModule from "@server/modules/auth";
import userModule from "@server/modules/users";

export const runtime = "nodejs";

// Hono init
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

// Cors Config
app.use("*", cors());

// Better Auth Config
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// Routes
app.route("/auth", authModule);
app.route("/users", userModule);

// 404 Not found
app.notFound((c) => {
  return c.json(
    {
      message: `${c.req.path} not found`,
    },
    404,
  );
});

export default app;
