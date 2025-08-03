import { Hono } from "hono";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { validateInput } from "@api/lib/validateInput";
import { boolean, mixed, number, object, string } from "yup";
import { rewardService } from "./rewardService";

const app = new Hono();

/*
    @route    POST: /users
    @access   private
    @desc     Create new user
*/
app.post("/", async (c) => {
  const body = await c.req.json();

  console.log("Reward Body", body);
  const validatedBody = await validateInput({
    type: "form",
    schema: object({
      name: string().required(),
      points: number().required(),
      isActive: boolean().required().default(true),
      icon: string().required(),
      description: string().required(),
      type: mixed<
        "LIKE" | "VIEW" | "RATING" | "SETUP" | "DISLIKE" | "LIBRARY"
      >()
        .oneOf(["LIKE", "VIEW", "RATING", "SETUP", "DISLIKE", "LIBRARY"])
        .required(),
    }),
    data: body, // ✅ Use the already-read body here
  });

  //   console.log(validatedBody, "validatedBody");

  const result = await rewardService.createReward(validatedBody);
  return c.json(result);
});

/*
  @route    PUT: /users/:id
  @access   private
  @desc     Update user by id
*/
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const validatedBody = await validateInput({
    type: "form",
    schema: object({
      name: string().required("Name is required"),
      points: number()
        .transform((_, val) => Number(val))
        .required("Points are required"),
      isActive: boolean()
        .transform(
          (val, originalVal) => originalVal === "true" || originalVal === true,
        )
        .required("isActive is required"),
      icon: string().required("Icon is required"),
      description: string().required("Description is required"),
      type: string().required("Type is required"),
    }),
    data: body,
  });

  const reward = await rewardService.findById(id);
  if (!reward) {
    return c.json({ error: "Reward not found" }, 404);
  }

  const updated = await rewardService.updateReward(id, validatedBody);

  return c.json(updated);
});
app.patch("/:id/toggle", async (c) => {
  const id = c.req.param("id");

  const reward = await rewardService.findById(id);
  if (!reward) {
    return c.json({ error: "Reward not found" }, 404);
  }

  const updated = await rewardService.toggleIsActive(id, {
    isActive: !reward.isActive,
  });

  return c.json(updated);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await rewardService.deleteReward(id);
  return c.json(result);
});

/*
  @route    GET: /users
  @access   private
  @desc     Get all users
*/
app.get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await rewardService.getAllRewards(validatedQuery);
  return c.json(result);
});

/*
  @route    GET: /users/:id
  @access   private
  @desc     Get user by id
*/
app.get("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await rewardService.findById(validatedParam.id);
  return c.json(result);
});

export default app;
