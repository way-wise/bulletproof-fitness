import { Hono } from "hono";
import { getSession } from "@/lib/auth";
import { dashboardService } from "./dashboardService";

const app = new Hono();

/*
  @route    GET: /dashboard/overview
  @access   private
  @desc     Get dashboard overview statistics and data
*/
app.get("/overview", async (c) => {
  try {
    const session = await getSession();
    if (
      !session?.user?.id ||
      (session.user.role !== "admin" && session.user.role !== "super")
    ) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const result = await dashboardService.getDashboardOverview();
    return c.json(result);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch dashboard overview",
      },
      500,
    );
  }
});

export default app;
