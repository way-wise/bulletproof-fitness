import { Hono } from "hono";

import { ReactionType } from "@/prisma/generated/enums";
import { mixed, number, object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { actionService } from "./actionService";
import { paginationQuerySchema } from "@/schema/paginationSchema";

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

  if (body.rating < 1 || body.rating > 5) throw new Error("Invalid rating");

  console.log("Rating", body.rating);
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

app.post("/feedback", async (c) => {
  const body = await c.req.json();

  const schema = object({
    fullName: string().required(),
    email: string().email().required(),
    phone: string().optional().nullable(),
    message: string().required(),
  });

  const validated = await validateInput({ type: "form", schema, data: body });

  await actionService.recordFeedback(
    validated.fullName,
    validated.email,
    validated.phone,
    validated.message,
  );
  return c.json({ success: true, message: "Feedback recorded" });
});

app.get("/feedback", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  console.log("Fetching feedback with query:", validatedQuery);

  const result = await actionService.getFeedback(validatedQuery);
  return c.json(result);
});

export default app;
