import { auth } from "@/lib/auth";
import {
  exerciseLibrarySchema,
  exerciseLibrarySchemaAdmin,
} from "@/schema/exerciseLibrarySchema";
import { Hono, type Context } from "hono";
import { validateInput } from "@api/lib/validateInput";
import { exerciseLibraryService } from "./exerciseLibraryService";

export const exerciseLibraryModule = new Hono();

// Helper function to get session from API request
const getApiSession = async (c: Context) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Get all exercise library videos for dashboard (admin)
exerciseLibraryModule.get("/dashboard", async (c) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    // Get query parameters
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const search = c.req.query("search") || "";

    const result = await exerciseLibraryService.getAllExerciseLibraryVideos(
      page,
      limit,
      search,
    );

    return c.json(result);
  } catch (error) {
    console.error("Error fetching exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch exercise library",
      },
      500,
    );
  }
});

// Get single exercise library video by ID
exerciseLibraryModule.get("/dashboard/:id", async (c) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await exerciseLibraryService.getExerciseLibraryVideoById(id);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching exercise library video:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch exercise library video",
      },
      500,
    );
  }
});

// Create exercise library video from dashboard admin
exerciseLibraryModule.post("/dashboard", async (c: Context) => {
  try {
    // Get current user session
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    // Parse JSON body instead of FormData
    const body = await c.req.json();

    // Add userId to the data
    const dataWithUserId = {
      ...body,
      userId: session.user.id,
    };

    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseLibrarySchemaAdmin,
      data: dataWithUserId,
    });

    console.log(validatedBody);
    const result =
      await exerciseLibraryService.createExerciseLibraryAdmin(validatedBody);

    return c.json({
      success: true,
      message: "Exercise library created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in exercise library creation:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create exercise library",
      },
      500,
    );
  }
});

// Update exercise library video
exerciseLibraryModule.put("/dashboard/:id", async (c: Context) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const body = await c.req.json();

    const dataWithUserId = {
      ...body,
      userId: session.user.id,
    };

    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseLibrarySchemaAdmin,
      data: dataWithUserId,
    });

    const result = await exerciseLibraryService.updateExerciseLibraryVideo(
      id,
      validatedBody,
    );

    return c.json({
      success: true,
      message: "Exercise library updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update exercise library",
      },
      500,
    );
  }
});

// Delete exercise library video
exerciseLibraryModule.delete("/dashboard/:id", async (c: Context) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await exerciseLibraryService.deleteExerciseLibraryVideo(id);

    return c.json({
      success: true,
      message: "Exercise library deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete exercise library",
      },
      500,
    );
  }
});

// Block exercise library video
exerciseLibraryModule.post("/dashboard/:id/block", async (c: Context) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    const { blockReason } = body;

    if (!blockReason) {
      return c.json(
        {
          success: false,
          message: "Block reason is required",
        },
        400,
      );
    }

    const result = await exerciseLibraryService.blockExerciseLibraryVideo(
      id,
      blockReason,
    );

    return c.json({
      success: true,
      message: "Exercise library blocked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error blocking exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to block exercise library",
      },
      500,
    );
  }
});

// Unblock exercise library video
exerciseLibraryModule.post("/dashboard/:id/unblock", async (c: Context) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await exerciseLibraryService.unblockExerciseLibraryVideo(id);

    return c.json({
      success: true,
      message: "Exercise library unblocked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error unblocking exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to unblock exercise library",
      },
      500,
    );
  }
});

// Publish/Unpublish exercise library video
exerciseLibraryModule.patch("/dashboard/:id/status", async (c: Context) => {
  try {
    const session = await getApiSession(c);
    if (!session?.user?.id) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    const { isPublic, blocked, blockReason } = body;

    const result =
      await exerciseLibraryService.updateExerciseLibraryVideoStatus(id, {
        isPublic,
        blocked,
        blockReason,
      });

    return c.json({
      success: true,
      message: "Exercise library status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating exercise library status:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update exercise library status",
      },
      500,
    );
  }
});

// exercise library video for public access (unchanged)
exerciseLibraryModule.get("/", async (c) => {
  try {
    const result = await exerciseLibraryService.getExerciseLibrary();

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch exercise library",
      },
      500,
    );
  }
});

// Get exercise library with filters and pagination (public access)
exerciseLibraryModule.get("/filtered", async (c) => {
  try {
    // Get query parameters
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "12");
    const search = c.req.query("search") || "";
    const bodyPart = c.req.query("bodyPart") || "";
    const equipment = c.req.query("equipment") || "";
    const rack = c.req.query("rack") || "";
    const username = c.req.query("username") || "";
    const minHeight = parseInt(c.req.query("minHeight") || "0");
    const maxHeight = parseInt(c.req.query("maxHeight") || "85");
    const rating = parseInt(c.req.query("rating") || "0");
    const sortBy =
      (c.req.query("sortBy") as "title" | "createdAt" | "views" | "likes") ||
      "createdAt";
    const sortOrder = (c.req.query("sortOrder") as "asc" | "desc") || "desc";

    const result = await exerciseLibraryService.getExerciseLibraryWithFilters({
      page,
      limit,
      search,
      bodyPart,
      equipment,
      rack,
      username,
      minHeight,
      maxHeight,
      rating,
      sortBy,
      sortOrder,
    });

    return c.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching filtered exercise library:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch filtered exercise library",
      },
      500,
    );
  }
});

// create library video from public (unchanged)
exerciseLibraryModule.post("/", async (c) => {
  try {
    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseLibrarySchema,
      data: c.req.parseBody(),
    });

    const result =
      await exerciseLibraryService.createExerciseLibrary(validatedBody);

    return c.json({
      success: true,
      message: "Exercise library created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in exercise library creation:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create exercise library",
      },
      500,
    );
  }
});
