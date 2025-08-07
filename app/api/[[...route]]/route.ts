import { errorHandler } from "@/app/api/lib/errorHandler";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { handle } from "hono/vercel";
import actionModule from "../features/actions/actionModule";
import authModule from "../features/auth/authModule";
import { bodyPartsModule } from "../features/bodyParts/bodyPartsModule";
import dashboardModule from "../features/dashboard/dashboardModule";
import { demoCenterModule } from "../features/demo-centers/demoCentersModule";
import { equipmentModule } from "../features/equipments/equipmentModule";
import { exerciseLibraryModule } from "../features/exercise-library/exerciseLibraryModule";
import { exerciseSetupModule } from "../features/exercise-setup/exerciseSetupModule";
import { racksModule } from "../features/racks/racksModule";
import rewardModule from "../features/rewards/rewardModule";
import signUploadModule from "../features/sign-upload/signUploadModule";
import userModule from "../features/users/userModule";

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
app.route("/exercise-library", exerciseLibraryModule);
app.route("/exercise-setup", exerciseSetupModule);
app.route("/rewards", rewardModule);
app.route("/action", actionModule);
app.route("/sign-upload", signUploadModule);
app.route("/dashboard", dashboardModule);

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
