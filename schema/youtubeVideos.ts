import * as yup from "yup";

// YouTube Video Schema
export const youtubeVideoSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1, "Title must not be empty"),
  description: yup.string().optional(),
  videoId: yup.string().required("Video ID is required"),
  videoUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Video URL is required"),
  thumbnail: yup.string().url("Must be a valid URL").optional(),
  tags: yup.array().of(yup.string()).default([]),
  category: yup.string().required("Category is required"),
  privacy: yup
    .string()
    .oneOf(["public", "private", "unlisted"])
    .default("private"),
  status: yup
    .string()
    .oneOf(["uploaded", "processing", "failed"])
    .default("uploaded"),
  duration: yup.number().positive().optional(),
  viewCount: yup.number().min(0).default(0),
  likeCount: yup.number().min(0).default(0),
  commentCount: yup.number().min(0).default(0),
  uploadDate: yup.date().default(() => new Date()),
  publishedAt: yup.date().optional(),
  userId: yup.string().required("User ID is required"),
  isPublic: yup.boolean().default(false),
  blocked: yup.boolean().default(false),
  blockReason: yup.string().optional(),
});

// Update YouTube Video Schema
export const updateYouTubeVideoSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  thumbnail: yup.string().url("Must be a valid URL").optional(),
  tags: yup.array().of(yup.string()).optional(),
  category: yup.string().optional(),
  privacy: yup.string().oneOf(["public", "private", "unlisted"]).optional(),
  status: yup.string().oneOf(["uploaded", "processing", "failed"]).optional(),
  viewCount: yup.number().min(0).optional(),
  likeCount: yup.number().min(0).optional(),
  commentCount: yup.number().min(0).optional(),
  publishedAt: yup.date().optional(),
  isPublic: yup.boolean().optional(),
  blocked: yup.boolean().optional(),
  blockReason: yup.string().optional(),
});

// Update YouTube Video Status Schema
export const updateYouTubeVideoStatusSchema = yup.object({
  isPublic: yup.boolean().optional(),
  blocked: yup.boolean().optional(),
  blockReason: yup.string().optional(),
});

// Block YouTube Video Schema
export const blockYouTubeVideoSchema = yup.object({
  videoId: yup.string().required("Video ID is required"),
  blockReason: yup.string().required("Block reason is required"),
});

// Unblock YouTube Video Schema
export const unblockYouTubeVideoSchema = yup.object({
  videoId: yup.string().required("Video ID is required"),
});

// Search YouTube Videos Schema
export const searchYouTubeVideosSchema = yup.object({
  query: yup.string().required("Search query is required"),
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
});

// Get Videos by User Schema
export const getVideosByUserSchema = yup.object({
  userId: yup.string().required("User ID is required"),
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
});
