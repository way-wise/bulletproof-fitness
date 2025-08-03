import { Hono } from "hono";

import { ReactionType } from "@/prisma/generated/enums";
import { object, string, number, mixed } from "yup";
import { validateInput } from "../../lib/validateInput";
import { actionService } from "./actionService";

const app = new Hono();

/**
 * @route    POST /api/action/react
 * @desc     Like/Dislike a content (exercise or library)
 */
app.post("/react", async (c) => {
  const body = await c.req.json();

  const schema = object({
    contentId: string().required(),
    key: mixed<"setup" | "lib">().oneOf(["setup", "lib"]).required(),
    type: mixed<ReactionType>().oneOf(["LIKE", "DISLIKE"]).required(),
  });

  const validated = await validateInput({ type: "form", schema, data: body });

  await actionService.giveReaction(
    validated.contentId,
    validated.key,
    validated.type,
  );
  return c.json({ success: true, message: "Reaction recorded" });
});

/**
 * @route    POST /api/action/rate
 * @desc     Rate a content (1-5 stars)
 */
app.post("/rate", async (c) => {
  const body = await c.req.json();

  const schema = object({
    contentId: string().required(),
    key: mixed<"setup" | "lib">().oneOf(["setup", "lib"]).required(),
    rating: number().min(1).max(5).required(),
  });

  const validated = await validateInput({ type: "form", schema, data: body });

  await actionService.giveRating(
    validated.contentId,
    validated.key,
    validated.rating,
  );
  return c.json({ success: true, message: "Rating recorded" });
});

/**
 * @route    POST /api/action/view
 * @desc     Record a content view
 */
app.post("/view", async (c) => {
  const body = await c.req.json();

  const schema = object({
    contentId: string().required(),
    key: mixed<"setup" | "lib">().oneOf(["setup", "lib"]).required(),
  });

  const validated = await validateInput({ type: "form", schema, data: body });

  await actionService.recordView(validated.contentId, validated.key);
  return c.json({ success: true, message: "View recorded" });
});

export default app;
