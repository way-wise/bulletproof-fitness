import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check if environment variables are set
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_DRIVE_FOLDER_ID
    ) {
      return NextResponse.json(
        {
          error: "Google Drive credentials not configured",
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

    // Test 1: Verify authentication
    const about = await drive.about.get({
      fields: "user",
    });

    // Test 2: Verify folder access
    const folder = await drive.files.get({
      fileId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      fields: "id,name,mimeType,permissions",
    });

    // Test 3: List files in folder
    const files = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      fields: "files(id,name,mimeType,createdTime)",
      pageSize: 5,
    });

    return NextResponse.json({
      success: true,
      message: "Google Drive connection successful",
      details: {
        authenticatedUser: about.data.user,
        folder: {
          id: folder.data.id,
          name: folder.data.name,
          type: folder.data.mimeType,
          permissions: folder.data.permissions?.length || 0,
        },
        filesInFolder: files.data.files?.length || 0,
        sampleFiles: files.data.files?.slice(0, 3) || [],
      },
    });
  } catch (error: any) {
    console.error("Google Drive test error:", error);
    return NextResponse.json(
      {
        error: "Google Drive test failed",
        details: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
      },
      { status: 500 },
    );
  }
}
