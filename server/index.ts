import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { auth } from "@server/lib/auth";
import { initAuth } from "@/server/middlewares/authMiddleware";
import { errorHandler } from "@server/middlewares/errorMiddleware";
import authModule from "@/server/modules/authModule";

export const runtime = "nodejs";

// Hono init
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

// Secure Headers
app.use(secureHeaders());

// Cors config
app.use(cors());

// Auth init
app.use(initAuth);

// Routes
app.route("/auth", authModule);

// Not found
app.notFound((c) => {
  return c.json(
    {
      message: `${c.req.path} Not Found`,
    },
    404,
  );
});

// Error Handler
app.onError(errorHandler);

export default app;
