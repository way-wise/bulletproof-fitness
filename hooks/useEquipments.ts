import useSWR from "swr";

export type Equipment = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentResponse = {
  data: Equipment[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export const useEquipments = () => {
  const { data, error, isLoading, mutate } = useSWR<EquipmentResponse>(
    "/api/equipments/all",
    fetcher,
  );

  return {
    equipments: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
};
