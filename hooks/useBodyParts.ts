import useSWR from "swr";

export type BodyPart = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const useBodyParts = () => {
  const { data, error, isLoading, mutate } =
    useSWR<BodyPart[]>("/api/body-parts/all");

  return {
    bodyParts: data ?? [],
    isLoading,
    error,
    mutate,
  };
};
