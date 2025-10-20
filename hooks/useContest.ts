import useSWR from "swr";

interface ContestCard {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  order: number;
  cardType?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContestSection {
  id: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  isVisible: boolean;
  cards?: ContestCard[];
  createdAt: string;
  updatedAt: string;
}

interface Contest {
  id: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  sections?: ContestSection[];
  createdAt: string;
  updatedAt: string;
}

interface ContestResponse {
  success: boolean;
  data: Contest | null;
  message?: string;
}

interface ContestsResponse {
  success: boolean;
  data: Contest[];
  message?: string;
}

// Hook for getting active contest (public)
export function useActiveContest() {
  const { data, error, isLoading, mutate } = useSWR<ContestResponse>("/api/contest");

  return {
    contest: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for getting all contests (admin)
export function useContests() {
  const { data, error, isLoading, mutate } = useSWR<ContestsResponse>("/api/contest/admin");

  return {
    contests: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for getting contest by ID (admin)
export function useContest(id: string) {
  const { data, error, isLoading, mutate } = useSWR<ContestResponse>(
    id ? `/api/contest/${id}` : null
  );

  return {
    contest: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
}