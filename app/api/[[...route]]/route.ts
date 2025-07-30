import { errorHandler } from "@/app/api/lib/errorHandler";
import { equipmentModule } from "@api/features/equipments/equipmentModule";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { handle } from "hono/vercel";

import authModule from "@api/features/auth/authModule";
import userModule from "@api/features/users/userModule";
import { bodyPartsModule } from "../features/bodyParts/bodyPartsModule";

// Hono init
const app = new Hono().basePath("/api");

// Secure headers
app.use(secureHeaders());

// Cors config
app.use(cors());

// Routes
app.route("/auth", authModule);
app.route("/users", userModule);
app.route("/equipments", equipmentModule);
app.route("/body-parts", bodyPartsModule);
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
export const PUT = handle(app);
export const DELETE = handle(app);
