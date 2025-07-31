import { useEffect, useState } from "react";

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

interface UseEquipmentsReturn {
  equipments: Equipment[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export const useEquipments = (): UseEquipmentsReturn => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEquipments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/equipments");
      if (!response.ok) {
        throw new Error("Failed to fetch equipments");
      }

      const data: EquipmentResponse = await response.json();
      setEquipments(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch equipments"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const mutate = () => {
    fetchEquipments();
  };

  return {
    equipments,
    isLoading,
    error,
    mutate,
  };
};
