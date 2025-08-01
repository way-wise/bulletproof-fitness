# Google Drive Setup Guide - Fix Folder Access Issue

## Current Error

You're getting: `"File not found: 13DnB6yIhsMPwpytjf9yCZnGAoHLlTWjU"`

This means your Google Drive folder ID is either:

1. **Invalid** - Not a real folder ID
2. **Inaccessible** - Your service account can't access it
3. **Deleted** - The folder no longer exists

## Step-by-Step Fix

### 1. Create a New Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "Folder"
3. Name it something like "Exercise Videos" or "Video Uploads"
4. Right-click the folder → "Share"
5. Add your service account email (from your .env file) with "Editor" permissions
6. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

### 2. Update Your Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Drive API Credentials
GOOGLE_CLIENT_EMAIL="your-service-account-email@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_ID="YOUR_NEW_FOLDER_ID_HERE"
```

### 3. Verify Your Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "IAM & Admin" → "Service Accounts"
4. Find your service account
5. Make sure it has the "Editor" role for Google Drive API

### 4. Test the Setup

1. Restart your development server: `pnpm dev`
2. Try uploading a video through your form
3. Check the network response for detailed error messages

## Common Issues & Solutions

### Issue: "File not found"

**Solution**: Create a new folder and update the folder ID

### Issue: "Permission denied"

**Solution**: Share the folder with your service account email

### Issue: "Invalid credentials"

**Solution**: Check your service account JSON key and email

### Issue: "API not enabled"

**Solution**: Enable Google Drive API in Google Cloud Console

## Quick Test

To test if your setup works:

1. Create a simple test folder in Google Drive
2. Share it with your service account
3. Update the folder ID in your `.env.local`
4. Try uploading a small video file

## Environment Variables Format

Make sure your `.env.local` file looks like this:

```env
# Database
DATABASE_URL="your-database-url"

# Google Drive API
GOOGLE_CLIENT_EMAIL="video-upload@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_ID="1ABC123DEF456GHI789JKL"

# Other variables...
```

**Important**: The private key should be the entire key including the BEGIN and END lines, with `\n` for line breaks.
