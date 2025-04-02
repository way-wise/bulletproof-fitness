import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { errorHandler } from "@api/lib/errorHandler";

import authModule from "@api/features/auth/authModule";
import userModule from "@api/features/users/userModule";

export const runtime = "nodejs";

// Hono init
const app = new Hono().basePath("/api");

// Secure headers
app.use(secureHeaders());

// Cors config
app.use(cors());

// Routes
app.route("/auth", authModule);
app.route("/users", userModule);

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

export const GET = handle(app);
export const POST = handle(app);
