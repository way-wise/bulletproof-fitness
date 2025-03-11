import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@server/lib/auth";
import { initAuth } from "@/server/middlewares/authMiddleware";
import authModule from "@/server/modules/authModule";

export const runtime = "nodejs";

// Hono init
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

// Cors config
app.use("*", cors());

// Auth init
app.use("*", initAuth);

// Routes
app.route("/auth", authModule);

export default app;
