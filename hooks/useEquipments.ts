import useSWR from "swr";

export type Equipment = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};


export const useEquipments = () => {
  const { data, error, isLoading, mutate } = useSWR<Equipment[]>(
    "/api/equipments/all",
  );

  return {
    equipments: data ?? [],
    isLoading,
    error,
    mutate,
  };
};
