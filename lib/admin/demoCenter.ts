import { apiRequest } from "@/lib/request";

export const demoCenterAdmin = {
  block: (data: { demoCenterId: string; blockReason: string }) =>
    apiRequest("/api/demo-centers/block", "POST", data),

  unblock: (data: { demoCenterId: string }) =>
    apiRequest("/api/demo-centers/unblock", "POST", data),

  delete: ({ demoCenterId }: { demoCenterId: string }) =>
    apiRequest(`/api/demo-centers/${demoCenterId}`, "DELETE"),

  updateStatus: (data: {
    demoCenterId: string;
    isPublic?: boolean;
    blocked?: boolean;
    blockReason?: string;
  }) =>
    apiRequest(`/api/demo-centers/${data.demoCenterId}/status`, "PATCH", data),
};
