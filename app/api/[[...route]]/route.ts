import { errorHandler } from "@/app/api/lib/errorHandler";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { handle } from "hono/vercel";
import { equipmentModule } from "../features/equipments/equipmentModule";

import authModule from "../features/auth/authModule";
import { bodyPartsModule } from "../features/bodyParts/bodyPartsModule";
import { demoCenterModule } from "../features/demo-centers/demoCentersModule";
import { exerciseLibraryVideoModule } from "../features/exercise-library-videos/exerciseLibraryVideoModule";
import { racksModule } from "../features/racks/racksModule";
import userModule from "../features/users/userModule";
import youtubeVideoModule from "../features/youtube-videos/youtubeVideoModule";

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
app.route("/racks", racksModule);
app.route("/demo-centers", demoCenterModule);
app.route("/youtube-videos", youtubeVideoModule);
app.route("/exercise-library-videos", exerciseLibraryVideoModule);
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
export const PATCH = handle(app);
export const DELETE = handle(app);
