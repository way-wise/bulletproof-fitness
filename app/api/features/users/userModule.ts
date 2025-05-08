import { Hono } from "hono";
import { userService } from "./userService";
import { zValidator } from "@hono/zod-validator";
import { paginationQuerySchema } from "@/schema/paginationSchema";

const app = new Hono().get(
  "/",
  zValidator("query", paginationQuerySchema),
  async (c) => {
    const validatedQuery = c.req.valid("query");

    const result = await userService.getUsers(validatedQuery);
    return c.json(result);
  },
);

export default app;
