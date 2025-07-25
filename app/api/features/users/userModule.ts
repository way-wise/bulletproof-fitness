import { Hono } from "hono";
import { userService } from "./userService";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { validateInput } from "@api/lib/validateInput";

const app = new Hono().get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await userService.getUsers(validatedQuery);
  return c.json(result);
});

export default app;
export type UserType = typeof app;
