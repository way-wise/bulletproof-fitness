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

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch body parts");
  return res.json();
};

export const useBodyParts = (): UseBodyPartsReturn => {
  const { data, error, isLoading, mutate } = useSWR<BodyPartResponse>(
    "/api/body-parts",
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 0,
    },
  );

  return {
    bodyParts: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
};
