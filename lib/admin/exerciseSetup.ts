import { apiRequest } from "@/lib/request";

export const exerciseSetupAdmin = {
  block: (data: { videoId: string; blockReason: string }) =>
    apiRequest(`/api/exercise-setup/dashboard/${data.videoId}/block`, "POST", {
      blockReason: data.blockReason,
    }),

  unblock: ({ videoId }: { videoId: string }) =>
    apiRequest(`/api/exercise-setup/dashboard/${videoId}/unblock`, "POST"),

  delete: ({ videoId }: { videoId: string }) =>
    apiRequest(`/api/exercise-setup/dashboard/${videoId}`, "DELETE"),

  updateStatus: (data: {
    videoId: string;
    isPublic?: boolean;
    blocked?: boolean;
    blockReason?: string;
  }) =>
    apiRequest(
      `/api/exercise-setup/dashboard/${data.videoId}/status`,
      "PATCH",
      data,
    ),
};
