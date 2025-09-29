import { getSession } from "@/lib/auth";
import {
  exerciseLibrarySchema,
  exerciseLibrarySchemaAdmin,
} from "@/schema/exerciseLibrarySchema";
import { validateInput } from "@api/lib/validateInput";
import { Hono, type Context } from "hono";
import { exerciseLibraryService } from "./exerciseLibraryService";
import { extractPublicId } from "cloudinary-build-url";
import cloudinary from "@api/lib/cloudinary";

export const exerciseLibraryModule = new Hono();

// Get all exercise library videos for dashboard (admin)
exerciseLibraryModule.get("/dashboard", async (c) => {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    // Get query parameters using proper pagination pattern
    const query = {
      page: parseInt(c.req.query("page") || "1"),
      limit: parseInt(c.req.query("limit") || "10"),
      search: c.req.query("search") || "",
    };

    const result =
      await exerciseLibraryService.getAllExerciseLibraryVideos(query);

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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
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
      schema: exerciseLibrarySchemaAdmin,
      data: dataWithUserId,
    });

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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
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
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "admin") {
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

// exercise library video for public access with filters
exerciseLibraryModule.get("/", async (c) => {
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
      await exerciseLibraryService.getExerciseLibraryWithFilters(filterParams);

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

exerciseLibraryModule.post("/", async (c) => {
  try {
    const validatedBody = await validateInput({
      type: "form",
      schema: exerciseLibrarySchema,
      data: await c.req.json(),
    });

    const result =
      await exerciseLibraryService.createExerciseLibrary(validatedBody);

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

exerciseLibraryModule.get("/videos", async (c) => {
  try {
    const result = await exerciseLibraryService.getExerciseLibraryVideos();
    return c.json(result);
  } catch (error) {
    console.error("Error fetching exercise library videos:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch exercise library videos",
      },
      500,
    );
  }
});

// Create library video information when youtube video is published
exerciseLibraryModule.post("/youtube/callback", async (c) => {
  const rawData = await c.req.json();

  const result =
    await exerciseLibraryService.createExerciseLibraryFromYoutube(rawData);
  return c.json(result);
});

// Delete Video from cloudinary after uploaded to youtube
exerciseLibraryModule.post("/youtube/uploaded", async (c) => {
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
