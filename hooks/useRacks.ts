import useSWR from "swr";

export type Rack = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type RackResponse = {
  data: Rack[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

interface UseRacksReturn {
  racks: Rack[];
  meta: RackResponse["meta"] | null;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch racks");
  return res.json();
};

export const useRacks = (): UseRacksReturn => {
  const { data, error, isLoading, mutate } = useSWR<RackResponse>(
    "/api/racks",
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 0,
    },
  );

  return {
    racks: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
};
