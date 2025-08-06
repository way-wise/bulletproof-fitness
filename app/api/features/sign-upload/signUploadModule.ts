import { v2 as cloudinary } from "cloudinary";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  const body = (await c.req.json()) as { paramsToSign: Record<string, string> };
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return c.json({ signature });
});

app.delete("/:publicId", async (c) => {
  const { publicId } = c.req.param();

  if (!publicId) {
    return c.json({ success: false, message: "Public ID is required" }, 400);
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      invalidate: true,
    });
    return c.json({ success: true, message: "Video deleted" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return c.json({ success: false, message: "Failed to delete video" }, 500);
  }
});

export default app;
