import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./modules/auth";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.route("/auth", auth);

export default app;
