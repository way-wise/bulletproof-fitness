import { useEffect, useState } from "react";

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
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export const useRacks = (): UseRacksReturn => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRacks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/racks");
      if (!response.ok) {
        throw new Error("Failed to fetch racks");
      }

      const data: RackResponse = await response.json();
      setRacks(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch racks"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRacks();
  }, []);

  const mutate = () => {
    fetchRacks();
  };

  return {
    racks,
    isLoading,
    error,
    mutate,
  };
};
