import { auth } from "@/lib/auth";
import {
  exerciseSetupSchema,
  exerciseSetupSchemaAdmin,
} from "@/schema/exerciseSetupSchema";
import { Hono, type Context } from "hono";
import { validateInput } from "../../lib/validateInput";
import { exerciseSetupService } from "./exerciseSetupService";

export const exerciseSetupModule = new Hono();

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
exerciseSetupModule.get("/dashboard", async (c) => {
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

    const result = await exerciseSetupService.getAllExerciseSetupVideos(
      page,
      limit,
      search,
    );

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

// create library video from public (unchanged)
// exerciseSetupModule.post("/", async (c) => {
//   try {
//     // Get current user session
//     const session = await getApiSession(c);
//     if (!session?.user?.id) {
//       return c.json(
//         {
//           success: false,
//           message: "Authentication required",
//         },
//         401,
//       );
//     }

//     const formData = await c.req.formData();

//     // Extract fields from formData
//     const validatedBody = {
//       title: formData.get("title") as string,
//       equipment: [(formData.get("equipment") as string) || ""],
//       bodyPart: [(formData.get("bodyPart") as string) || ""],
//       height: formData.get("height") as string,
//       rack: [(formData.get("rack") as string) || ""],
//       video: formData.get("video") as File,
//       userId: session.user.id,
//       // Pump by numbers fields
//       isolatorHole: (formData.get("isolatorHole") as string) || null,
//       yellow: (formData.get("yellow") as string) || null,
//       green: (formData.get("green") as string) || null,
//       blue: (formData.get("blue") as string) || null,
//       red: (formData.get("red") as string) || null,
//       purple: (formData.get("purple") as string) || null,
//       orange: (formData.get("orange") as string) || null,
//     } as InferType<typeof exerciseSetupSchema> & { video: File };

//     // Validate required fields
//     if (
//       !validatedBody.title ||
//       !validatedBody.equipment ||
//       !validatedBody.bodyPart ||
//       !validatedBody.height ||
//       !validatedBody.rack ||
//       !validatedBody.video
//     ) {
//       return c.json(
//         {
//           success: false,
//           message: "All fields are required",
//         },
//         400,
//       );
//     }

//     const result =
//       await exerciseSetupService.createExerciseSetupAdmin(validatedBody);

//     return c.json({
//       success: true,
//       message: "Exercise setup created successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in exercise library creation:", error);
//     return c.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to create exercise setup",
//       },
//       500,
//     );
//   }
// });

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
