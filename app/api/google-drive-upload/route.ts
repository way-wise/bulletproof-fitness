import prisma from "@/lib/prisma";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    // Check if environment variables are set
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_DRIVE_FOLDER_ID
    ) {
      return NextResponse.json(
        {
          error:
            "Google Drive credentials not configured. Please check your environment variables.",
          details: {
            hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
            hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
            folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
          },
        },
        { status: 500 },
      );
    }

    // Google Drive auth setup
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Parse multipart/form-data using Next.js built-in parser
    const formData = await req.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const equipment = formData.get("equipment") as string;
    const bodyPart = formData.get("bodyPart") as string;
    const height = formData.get("height") as string;
    const rack = formData.get("rack") as string;
    const videoFile = formData.get("video") as File;

    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 },
      );
    }

    // Convert File to Buffer and then to Readable Stream for Google Drive upload
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // End the stream

    // First, verify the folder exists and is accessible
    try {
      await drive.files.get({
        fileId: process.env.GOOGLE_DRIVE_FOLDER_ID,
        fields: "id,name",
      });
    } catch (folderError: any) {
      console.error("Folder access error:", folderError);
      return NextResponse.json(
        {
          error:
            "Google Drive folder not accessible. Please check your folder ID and permissions.",
          details: {
            folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
            folderError: folderError.message,
          },
        },
        { status: 500 },
      );
    }

    const fileMetadata = {
      name: `${Date.now()}_${videoFile.name}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: videoFile.type,
      body: stream,
    };

    // Upload file to Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    const fileId = response.data.id;

    // Make file public
    if (fileId) {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    }

    const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;

    // Save to Postgres via Prisma
    const video = await prisma.exerciseLibraryVideo.create({
      data: {
        title: title,
        videoUrl: driveUrl, // Store the Google Drive URL as videoUrl
        equipment: equipment,
        bodyPart: bodyPart,
        height: height,
        rack: rack,
        userId: "temp-user-id", // This should be replaced with actual user ID from auth
      },
    });

    return NextResponse.json({
      success: true,
      video,
      message: "Video uploaded to Google Drive successfully",
    });
  } catch (error: any) {
    console.error("Google Drive upload error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to upload video",
        details: error.response?.data || error,
      },
      { status: 500 },
    );
  }
}
