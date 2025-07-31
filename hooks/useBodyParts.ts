import { useEffect, useState } from "react";

export type BodyPart = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type BodyPartResponse = {
  data: BodyPart[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

interface UseBodyPartsReturn {
  bodyParts: BodyPart[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export const useBodyParts = (): UseBodyPartsReturn => {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBodyParts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/body-parts");
      if (!response.ok) {
        throw new Error("Failed to fetch body parts");
      }

      const data: BodyPartResponse = await response.json();
      setBodyParts(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch body parts"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBodyParts();
  }, []);

  const mutate = () => {
    fetchBodyParts();
  };

  return {
    bodyParts,
    isLoading,
    error,
    mutate,
  };
};
