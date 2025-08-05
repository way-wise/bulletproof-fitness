import useSWR from "swr";

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
  meta: BodyPartResponse["meta"] | null;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
}

export const useBodyParts = (): UseBodyPartsReturn => {
  const { data, error, isLoading, mutate } =
    useSWR<BodyPartResponse>("/api/body-parts/all");

  return {
    bodyParts: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
};
