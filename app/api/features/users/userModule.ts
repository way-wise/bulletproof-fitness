import { Hono } from "hono";
import { userService } from "./userService";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { validateInput } from "@api/lib/validateInput";
import { object, string } from "yup";

const app = new Hono();

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

  const result = await userService.getUsers(validatedQuery);
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

app.get("/:id/rewards", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await userService.getUserRewards(
    validatedParam.id,
    validatedQuery,
  );
  return c.json(result);
});

export default app;
