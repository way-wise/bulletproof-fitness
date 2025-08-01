import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
});

apiRoute.use(upload.single("video"));

apiRoute.post(async (req: any, res: NextApiResponse) => {
  try {
    const buffer = req.file.buffer;
    const base64 = buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: "exercise-library",
      public_id: uuidv4(),
    });

    // ✅ Save this info to your DB
    const videoData = {
      title: req.body.title,
      equipment: req.body.equipment,
      bodyPart: req.body.bodyPart,
      height: req.body.height,
      rack: req.body.rack,
      videoUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    };

    // Example: Save to your DB
    // await prisma.video.create({ data: videoData });

    res.status(200).json({ success: true, video: videoData });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};
