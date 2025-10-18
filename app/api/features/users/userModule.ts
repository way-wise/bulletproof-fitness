import { paginationQuerySchema } from "@/schema/paginationSchema";
import { validateInput } from "@api/lib/validateInput";
import { Hono } from "hono";
import { object, string } from "yup";
import { userService } from "./userService";

const app = new Hono();

/*
  @route    GET: /users
  @access   private
  @desc     Get all users
*/
app.get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema && object({
      search: string().optional(),
      role: string().optional(),
      banned: string().optional(),
      emailVerified: string().optional(),
      sortBy: string().optional(),
      sortOrder: string().optional(),
    }),
    data: c.req.query(),
  });

  const result = await userService.getUsers(validatedQuery);
  return c.json(result);
});

/*
  @route    GET: /users/suggestions
  @access   private
  @desc     Get user suggestions for search
*/
app.get("/suggestions", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: object({
      search: string().required("Search query is required"),
      limit: string().optional(),
    }),
    data: c.req.query(),
  });

  const result = await userService.getUserSuggestions(validatedQuery);
  return c.json(result);
});

/*
  @route    GET: /users/me
  @access   private
  @desc     Get current user profile
*/
app.get("/me", async (c) => {
  const result = await userService.getCurrentUser();
  return c.json(result);
});

/*
  @route    PUT: /users/me
  @access   private
  @desc     Update current user profile
*/
app.put("/me", async (c) => {
  const body = await c.req.json();
  const result = await userService.updateCurrentUser(body);
  return c.json(result);
});

/*
  @route    GET: /users/leaderboard
  @access   private
  @desc     Get leaderboard data
*/
app.get("/leaderboard", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await userService.getLeaderboard(validatedQuery);
  return c.json(result);
});

/*
  @route    GET: /users/:id/rewards
  @access   private
  @desc     Get user rewards/action history
*/
app.get("/:id/rewards", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await userService.getUserRewards(validatedParam.id);
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

  const result = await userService.getUser(validatedParam.id);
  return c.json(result);
});

export default app;
