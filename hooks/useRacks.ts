import useSWR from "swr";

export type Rack = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};


export const useRacks = () => {
  const { data, error, isLoading, mutate } = useSWR<Rack[]>(
    "/api/racks/all",
  );

  return {
    racks: data ?? [],
    isLoading,
    error,
    mutate,
  };
};
