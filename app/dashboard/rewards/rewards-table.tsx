// FULL Reward Management Table with Add, Update, Toggle isActive (NO Delete)

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date-format";
import { rewardsSchema } from "@/schema/rewardsSchema";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export type TReward = InferType<typeof rewardsSchema> & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

const RewardsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<TReward | null>(null);

  const url = `/api/rewards?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
  const { isValidating, data } = useSWR(url);

  const rewardForm = useForm<InferType<typeof rewardsSchema>>();

  const handleAddOrUpdateReward = async (values: {
    description?: string | undefined;
    type:
      | "LIKE"
      | "VIEW"
      | "RATING"
      | "UPLOAD_EXERCISE"
      | "UPLOAD_LIBRARY"
      | "DISLIKE";
    icon?: string | undefined;
    name: string;
    points: number;
    isActive: boolean;
  }) => {
    try {
      const isEdit = !!selectedReward;
      const endpoint = isEdit
        ? `/api/rewards/${selectedReward.id}`
        : "/api/rewards";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update reward");
      }

      toast.success(`Reward ${isEdit ? "updated" : "created"} successfully`);
      mutate(url);
      rewardForm.reset();
      setEditModalOpen(false);
      setSelectedReward(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const toggleIsActive = async (reward: TReward) => {
    try {
      await fetch(`/api/rewards/${reward.id}/toggle`, {
        method: "PATCH",
      });
      toast.success("Status updated");
      mutate(url);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns: ColumnDef<TReward>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Points",
      accessorKey: "points",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => {
        const reward = row.original;
        return (
          <Switch
            checked={reward.isActive}
            onCheckedChange={() => toggleIsActive(reward)}
          />
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt || ""),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => formatDate(row.original.updatedAt || ""),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const reward = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Pencil className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedReward(reward);
                  // Convert null values to empty strings to prevent React warning
                  const formData = {
                    ...reward,
                    description: reward.description || "",
                    icon: reward.icon || "",
                  };
                  rewardForm.reset(formData);
                  setEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>

              {!reward.isActive && (
                <DropdownMenuItem
                  onClick={() => toggleIsActive(reward)}
                  className="text-green-600"
                >
                  Enable
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex justify-between">
        <h1 className="text-2xl font-semibold">Rewards</h1>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isPending={isValidating}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          rewardForm.reset();
          setEditModalOpen(false);
          setSelectedReward(null);
        }}
        title={selectedReward ? "Edit Reward" : "Add Reward"}
        isPending={rewardForm.formState.isSubmitting}
      >
        <Form {...rewardForm}>
          <form
            onSubmit={rewardForm.handleSubmit(handleAddOrUpdateReward)}
            className="p-5"
          >
            <FormFieldset>
              <FormField
                control={rewardForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Reward name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={rewardForm.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={rewardForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select reward type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LIKE">Like</SelectItem>
                        <SelectItem value="VIEW">View</SelectItem>
                        <SelectItem value="RATING">Rating</SelectItem>
                        <SelectItem value="UPLOAD_EXERCISE">
                          Upload Exercise
                        </SelectItem>
                        <SelectItem value="UPLOAD_LIBRARY">
                          Upload Library
                        </SelectItem>
                        <SelectItem value="DISLIKE">Dislike</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={rewardForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={rewardForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-5">
                <Button
                  type="button"
                  onClick={() => {
                    rewardForm.reset();
                    setEditModalOpen(false);
                    setSelectedReward(null);
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={rewardForm.formState.isSubmitting}
                >
                  {selectedReward ? "Update" : "Create"}
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default RewardsTable;
