import { Hono } from "hono";
import { userService } from "./userService";

const app = new Hono();

/*
  @route    GET: /api/users
  @access   Private
  @desc     Get all users
*/
app.get("/", async (c) => {
  const users = await userService.getUsers();
  return c.json(users);
});

export default app;
