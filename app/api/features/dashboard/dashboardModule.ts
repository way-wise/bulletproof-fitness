import { Hono } from "hono";
import { dashboardService } from "./dashboardService";

const app = new Hono();

/*
  @route    GET: /dashboard/overview
  @access   private
  @desc     Get dashboard overview statistics and data
*/
app.get("/overview", async (c) => {
  const result = await dashboardService.getDashboardOverview();
  return c.json(result);
});

export default app;
