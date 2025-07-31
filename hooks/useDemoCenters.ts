import { DemoCenter, PaginatedData } from "@/lib/dataTypes";
import { useState } from "react";
import { toast } from "sonner";

export const useDemoCenters = () => {
  const [loading, setLoading] = useState(false);

  const getDemoCenters = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedData<DemoCenter> | null> => {
    try {
      const response = await fetch(
        `/api/demo-centers?page=${page}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch demo centers");
      }
      return await response.json();
    } catch (error) {
      toast.error("Failed to load demo centers");
      return null;
    }
  };

  const getDemoCenter = async (id: string): Promise<DemoCenter | null> => {
    try {
      const response = await fetch(`/api/demo-centers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch demo center");
      }
      return await response.json();
    } catch (error) {
      toast.error("Failed to load demo center");
      return null;
    }
  };

  const createDemoCenter = async (data: any): Promise<DemoCenter | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/demo-centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create demo center");
      }

      const result = await response.json();
      toast.success("Demo center created successfully");
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create demo center",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDemoCenterStatus = async (
    id: string,
    data: { isPublic?: boolean; blocked?: boolean; blockReason?: string },
  ): Promise<DemoCenter | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/demo-centers/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update demo center status");
      }

      const result = await response.json();
      toast.success("Demo center status updated successfully");
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update demo center status",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const blockDemoCenter = async (
    id: string,
    blockReason: string,
  ): Promise<DemoCenter | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/demo-centers/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demoCenterId: id, blockReason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to block demo center");
      }

      const result = await response.json();
      toast.success("Demo center blocked successfully");
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to block demo center",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unblockDemoCenter = async (id: string): Promise<DemoCenter | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/demo-centers/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demoCenterId: id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unblock demo center");
      }

      const result = await response.json();
      toast.success("Demo center unblocked successfully");
      return result;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to unblock demo center",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDemoCenter = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/demo-centers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete demo center");
      }

      toast.success("Demo center deleted successfully");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete demo center",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getDemoCenters,
    getDemoCenter,
    createDemoCenter,
    updateDemoCenterStatus,
    blockDemoCenter,
    unblockDemoCenter,
    deleteDemoCenter,
  };
};
