import { Hono } from "hono";
import { getSession } from "@/lib/auth";
import { ContestService } from "./contestService";
import { contestSchema, updateContestSchema } from "@/schema/contestSchema";
import { ValidationError } from "yup";

const app = new Hono();

/*
  @route    GET: /contest
  @access   public
  @desc     Get active contest for public display
*/
app.get("/", async (c) => {
  try {
    const result = await ContestService.getActiveContest();
    return c.json(result);
  } catch (error) {
    console.error("Error fetching active contest:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch contest",
      },
      500,
    );
  }
});

/*
  @route    GET: /contest/admin
  @access   private (admin only)
  @desc     Get all contests for admin management
*/
app.get("/admin", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const result = await ContestService.getAllContests();
    return c.json(result);
  } catch (error) {
    console.error("Error fetching contests:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch contests",
      },
      500,
    );
  }
});

/*
  @route    GET: /contest/:id
  @access   private (admin only)
  @desc     Get contest by ID
*/
app.get("/:id", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await ContestService.getContestById(id);
    return c.json(result);
  } catch (error) {
    console.error("Error fetching contest:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch contest",
      },
      500,
    );
  }
});

/*
  @route    POST: /contest
  @access   private (admin only)
  @desc     Create new contest
*/
app.post("/", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const body = await c.req.json();
    
    // Validate request body
    const validatedData = await contestSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await ContestService.createContest(validatedData);
    return c.json(result, result.success ? 201 : 400);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        400,
      );
    }

    console.error("Error creating contest:", error);
    return c.json(
      {
        success: false,
        message: "Failed to create contest",
      },
      500,
    );
  }
});

/*
  @route    PUT: /contest/:id
  @access   private (admin only)
  @desc     Update contest
*/
app.put("/:id", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    
    // Validate request body
    const validatedData = await updateContestSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await ContestService.updateContest(id, validatedData);
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        400,
      );
    }

    console.error("Error updating contest:", error);
    return c.json(
      {
        success: false,
        message: "Failed to update contest",
      },
      500,
    );
  }
});

/*
  @route    DELETE: /contest/:id
  @access   private (admin only)
  @desc     Delete contest
*/
app.delete("/:id", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await ContestService.deleteContest(id);
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error("Error deleting contest:", error);
    return c.json(
      {
        success: false,
        message: "Failed to delete contest",
      },
      500,
    );
  }
});

/*
  @route    PATCH: /contest/:id/toggle
  @access   private (admin only)
  @desc     Toggle contest active status
*/
app.patch("/:id/toggle", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    
    // Get current contest
    const currentResult = await ContestService.getContestById(id);
    if (!currentResult.success || !currentResult.data) {
      return c.json({
        success: false,
        message: "Contest not found",
      }, 404);
    }

    // Toggle the active status
    const result = await ContestService.updateContest(id, {
      isActive: !currentResult.data.isActive
    });
    
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error("Error toggling contest status:", error);
    return c.json(
      {
        success: false,
        message: "Failed to toggle contest status",
      },
      500,
    );
  }
});

export default app;
