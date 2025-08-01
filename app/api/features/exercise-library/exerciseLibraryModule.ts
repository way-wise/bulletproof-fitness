import { getSession } from "@/lib/auth";
import { Hono } from "hono";
import { exerciseLibraryService } from "./exerciseLibraryService";

export const exerciseLibraryModule = new Hono();
// exercise library video for dashbaord
exerciseLibraryModule.get("/", async (c) => {
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

    const result = await exerciseLibraryService.getExerciseLibrary(
      session.user.id,
    );

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

exerciseLibraryModule.post("/", async (c) => {
  try {
    // Get current user session
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

    const formData = await c.req.formData();

    // Extract fields from formData
    const validatedBody = {
      title: formData.get("title") as string,
      equipment: formData.get("equipment") as string,
      bodyPart: formData.get("bodyPart") as string,
      height: formData.get("height") as string,
      rack: formData.get("rack") as string,
      video: formData.get("video") as File, // this will be a Blob/File
      userId: session.user.id, // Get userId from session
    };

    console.log("validatedBody", validatedBody);

    // Validate required fields
    if (
      !validatedBody.title ||
      !validatedBody.equipment ||
      !validatedBody.bodyPart ||
      !validatedBody.height ||
      !validatedBody.rack ||
      !validatedBody.video
    ) {
      return c.json(
        {
          success: false,
          message: "All fields are required",
        },
        400,
      );
    }

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
