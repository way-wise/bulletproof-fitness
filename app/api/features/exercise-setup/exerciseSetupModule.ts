import { auth, getSession } from "@/lib/auth";
import {
  exerciseSetupSchema,
  exerciseSetupSchemaAdmin,
} from "@/schema/exerciseSetupSchema";
import { Hono, type Context } from "hono";
import { validateInput } from "../../lib/validateInput";
import { exerciseSetupService } from "./exerciseSetupService";
import { extractPublicId } from "cloudinary-build-url";
import cloudinary from "@api/lib/cloudinary";

export const exerciseSetupModule = new Hono();

// Get all exercise library videos for dashboard (admin)
exerciseSetupModule.get("/dashboard", async (c) => {
  try {
    // Get query parameters using proper pagination pattern
    const query = {
      page: parseInt(c.req.query("page") || "1"),
      limit: parseInt(c.req.query("limit") || "10"),
      search: c.req.query("search") || "",
      bodyPartIds: c.req.query("bodyPartIds") || "",
      equipmentIds: c.req.query("equipmentIds") || "",
      rackIds: c.req.query("rackIds") || "",
      isPublic: c.req.query("isPublic") || "",
      blocked: c.req.query("blocked") || "",
      sortBy: c.req.query("sortBy") || "createdAt",
      sortOrder: c.req.query("sortOrder") || "desc",
    };

    const result = await exerciseSetupService.getAllExerciseSetupVideos(query);

    return c.json({
      success: true,
      data: result.data,
      meta: result.meta,
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

// Get user videos for profile page
exerciseSetupModule.get("/user-videos", async (c) => {
  try {
    const session = await getSession();
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
    const userId = c.req.query("userId") || session.user.id;

    const result = await exerciseSetupService.getUserVideos(
      userId,
      page,
      limit,
    );

    return c.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch user videos",
      },
      500,
    );
  }
});

// Get single exercise library video by ID
exerciseSetupModule.get("/dashboard/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const result = await exerciseSetupService.getExerciseSetupVideoById(id);

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
exerciseSetupModule.post("/dashboard", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
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
      schema: exerciseSetupSchemaAdmin,
      data: dataWithUserId,
    });

    const result =
      await exerciseSetupService.createExerciseSetupAdmin(validatedBody);

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
exerciseSetupModule.put("/dashboard/:id", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
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

    const dataWithUserId = {
      ...body,
      userId: session.user.id,
    };

    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseSetupSchemaAdmin,
      data: dataWithUserId,
    });

    const result = await exerciseSetupService.updateExerciseSetupVideo(
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
exerciseSetupModule.delete("/dashboard/:id", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await exerciseSetupService.deleteExerciseLibraryVideo(id);

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
exerciseSetupModule.post("/dashboard/:id/block", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
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

    const result = await exerciseSetupService.blockExerciseSetupVideo(
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
exerciseSetupModule.post("/dashboard/:id/unblock", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const result = await exerciseSetupService.unblockExerciseSetupVideo(id);

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
exerciseSetupModule.patch("/dashboard/:id/status", async (c: Context) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
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
    const { isPublic, blocked, blockReason } = body;

    const result = await exerciseSetupService.updateExerciseSetupVideoStatus(
      id,
      {
        isPublic,
        blocked,
        blockReason,
      },
    );

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
exerciseSetupModule.get("/", async (c) => {
  try {
    // Get query parameters
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const search = c.req.query("search") || "";
    const bodyPartIds = c.req.query("bodyPartIds") || "";
    const equipmentIds = c.req.query("equipmentIds") || "";
    const rackIds = c.req.query("rackIds") || "";
    const username = c.req.query("username") || "";
    const minHeight = parseInt(c.req.query("minHeight") || "0");
    const maxHeight = parseInt(c.req.query("maxHeight") || "85");
    const minRating = parseInt(c.req.query("minRating") || "0");

    // Parse comma-separated IDs
    const bodyPartIdsArray = bodyPartIds
      ? bodyPartIds.split(",").filter(Boolean)
      : [];
    const equipmentIdsArray = equipmentIds
      ? equipmentIds.split(",").filter(Boolean)
      : [];
    const rackIdsArray = rackIds ? rackIds.split(",").filter(Boolean) : [];

    // Build filter parameters
    const filterParams = {
      page,
      limit,
      search,
      bodyPartIds: bodyPartIdsArray,
      equipmentIds: equipmentIdsArray,
      rackIds: rackIdsArray,
      username,
      minHeight,
      maxHeight,
      minRating,
    };

    const result =
      await exerciseSetupService.getExerciseSetupWithFilters(filterParams);

    return c.json({
      success: true,
      ...result,
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

// Create exercise setup from public (Through Zapier)
exerciseSetupModule.post("/", async (c) => {
  try {
    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseSetupSchema,
      data: await c.req.json(),
    });

    const result =
      await exerciseSetupService.createExerciseSetup(validatedBody);

    return c.json(result);
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

// Create library video information when youtube video is published
exerciseSetupModule.post("/youtube/callback", async (c) => {
  const rawData = await c.req.json();
  const result =
    await exerciseSetupService.createExerciseSetupFromYoutube(rawData);
  return c.json(result);
});

// Delete Video from cloudinary after uploaded to youtube
exerciseSetupModule.post("/youtube/uploaded", async (c) => {
  const rawData = await c.req.json();

  // Extract public id and delete
  const publicId = extractPublicId(rawData.cloudinaryVideoUrl);
  const result = cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
  });

  return c.json({
    message: "Cloudinary video deleted",
    result,
  });
});
