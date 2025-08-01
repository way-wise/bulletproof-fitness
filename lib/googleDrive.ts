// libs/googleDrive.ts
import fs from "fs";
import { google } from "googleapis";
import path from "path";

// credentials.json path (Step 1 এ ডাউনলোড করা ফাইল)
const KEYFILEPATH = path.join(__dirname, "./credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (filePath: string, fileName: string) => {
  const fileMetadata = {
    name: fileName,
  };

  const media = {
    mimeType: "video/mp4", // প্রয়োজনে পরিবর্তন করো
    body: fs.createReadStream(filePath),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
  });

  return res.data;
};
