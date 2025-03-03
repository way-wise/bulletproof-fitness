import { Hono } from "hono";
import { requiresAuth } from "@server/middlewares/auth";

const app = new Hono();

app.use(requiresAuth);
app.get("/", (c) => c.json("user list"));
app.get("/:id", (c) => c.json("user details"));
app.post("/", (c) => c.json("user create"));
app.put("/:id", (c) => c.json("user update"));
app.delete("/:id", (c) => c.json("user delete"));

export default app;
