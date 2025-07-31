import {
  blockYouTubeVideoSchema,
  getVideosByUserSchema,
  searchYouTubeVideosSchema,
  unblockYouTubeVideoSchema,
  updateYouTubeVideoSchema,
  updateYouTubeVideoStatusSchema,
  youtubeVideoSchema,
} from "@/schema/youtubeVideos";
import { Hono } from "hono";
import { validateInput } from "../../lib/validateInput";
import { YouTubeVideoService } from "./youtubeVideoService";

const app = new Hono();

// GET /api/youtube-videos - Get all videos with pagination and search
app.get("/", async (c) => {
  try {
    const { page = "1", limit = "10", search, status } = c.req.query();

    const result = await YouTubeVideoService.getYouTubeVideos(
      parseInt(page),
      parseInt(limit),
      search,
      status,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /api/youtube-videos/public - Get public videos for frontend
app.get("/public", async (c) => {
  try {
    const { page = "1", limit = "10" } = c.req.query();

    const result = await YouTubeVideoService.getPublicVideos(
      parseInt(page),
      parseInt(limit),
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/youtube-videos - Create a new video
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = await validateInput({
      type: "form",
      schema: youtubeVideoSchema,
      data: body,
    });

    const result = await YouTubeVideoService.createYouTubeVideo(validatedData);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /api/youtube-videos/:id - Get a single video by ID
app.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const result = await YouTubeVideoService.getYouTubeVideoById(id);

    if (!result.success) {
      return c.json({ error: result.error }, 404);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PUT /api/youtube-videos/:id - Update a video
app.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const validatedData = await validateInput({
      type: "form",
      schema: updateYouTubeVideoSchema,
      data: body,
    });

    const result = await YouTubeVideoService.updateYouTubeVideo(
      id,
      validatedData,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// DELETE /api/youtube-videos/:id - Delete a video
app.delete("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const result = await YouTubeVideoService.deleteYouTubeVideo(id);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PATCH /api/youtube-videos/:videoId/status - Update video status (publish/unpublish)
app.patch("/:videoId/status", async (c) => {
  try {
    const { videoId } = c.req.param();
    const body = await c.req.json();
    const validatedData = await validateInput({
      type: "form",
      schema: updateYouTubeVideoStatusSchema,
      data: body,
    });

    const result = await YouTubeVideoService.updateYouTubeVideoStatus(
      videoId,
      validatedData.isPublic,
      validatedData.blocked,
      validatedData.blockReason,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/youtube-videos/block - Block a video
app.post("/block", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = await validateInput({
      type: "form",
      schema: blockYouTubeVideoSchema,
      data: body,
    });

    const result = await YouTubeVideoService.blockYouTubeVideo(
      validatedData.videoId,
      validatedData.blockReason,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/youtube-videos/unblock - Unblock a video
app.post("/unblock", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = await validateInput({
      type: "form",
      schema: unblockYouTubeVideoSchema,
      data: body,
    });

    const result = await YouTubeVideoService.unblockYouTubeVideo(
      validatedData.videoId,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /api/youtube-videos/user/:userId - Get videos by user
app.get("/user/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const { page = "1", limit = "10" } = c.req.query();

    const validatedData = await validateInput({
      type: "query",
      schema: getVideosByUserSchema,
      data: {
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });

    const result = await YouTubeVideoService.getVideosByUserId(
      validatedData.userId,
      validatedData.page,
      validatedData.limit,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /api/youtube-videos/search - Search videos
app.get("/search", async (c) => {
  try {
    const { query, page = "1", limit = "10" } = c.req.query();

    const validatedData = await validateInput({
      type: "query",
      schema: searchYouTubeVideosSchema,
      data: {
        query,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });

    const result = await YouTubeVideoService.searchYouTubeVideos(
      validatedData.query,
      validatedData.page,
      validatedData.limit,
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
