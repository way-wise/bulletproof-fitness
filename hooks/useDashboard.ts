import { DashboardOverview } from "@/app/api/features/dashboard/dashboardService";
import useSWR from "swr";

interface UseDashboardReturn {
  data: DashboardOverview | undefined;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const { data, error, isLoading, mutate } = useSWR<DashboardOverview>(
    "/api/dashboard/overview",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
