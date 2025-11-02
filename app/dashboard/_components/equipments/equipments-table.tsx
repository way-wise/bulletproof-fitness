"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
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
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

import { formatDate } from "@/lib/date-format";
import { equipmentSchema } from "@/schema/equipment";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";
import UpdateEquipments from "./UpdateEquipments";
import { TableFilters, FilterValues } from "../shared/TableFilters";
import { useSessionWithPermissions } from "@/hooks/useSessionWithPermissions";

type TEquipment = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

const EquipmentsTable = () => {
  const { data: session } = useSessionWithPermissions();

  // Permission checks
  const hasPermission = (action: string) => {
    if (!session?.user) return false;
    if (session.user.role === "super") return true;
    const user = session.user as any;
    return user.permissions?.some(
      (p: any) => p.resource === "equipment" && p.action === action
    ) || false;
  };

  const canCreate = hasPermission("create");
  const canUpdate = hasPermission("update");
  const canDelete = hasPermission("delete");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addEquipmentModalOpen, setAddEquipmentModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<TEquipment | null>(
    null,
  );
  const [equipmentId, setEquipmentId] = useState<string | undefined>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Build URL with filters
  const buildUrl = () => {
    const params = new URLSearchParams({
      page: pagination.pageIndex.toString(),
      limit: pagination.pageSize.toString(),
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return `/api/equipments?${params.toString()}`;
  };

  const url = buildUrl();
  const { isValidating, data } = useSWR(url);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, [filters]);

  // Add Equipment Form
  const addEquipmentForm = useForm({
    resolver: yupResolver(equipmentSchema),
    defaultValues: {
      name: "",
    },
  });

  // Handle Add Equipment
  const handleAddEquipment = async (
    values: InferType<typeof equipmentSchema>,
  ) => {
    try {
      const response = await fetch("/api/equipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create equipment");
      }

      toast.success("Equipment added successfully");
      setAddEquipmentModalOpen(false);
      addEquipmentForm.reset();
      mutate(url);
    } catch (error) {
      setAddEquipmentModalOpen(false);
      addEquipmentForm.reset();
      toast.error(
        error instanceof Error ? error.message : "Failed to create equipment",
      );
    }
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle Equipment Deletion
  const handleDeleteEquipment = async () => {
    try {
      const response = await fetch(`/api/equipments/${equipmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete equipment");
      }

      toast.success("Equipment deleted successfully");
      setDeleteModalOpen(false);
      mutate(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete equipment",
      );
    }
  };

  // Table columns
  const columns: ColumnDef<TEquipment>[] = [
    {
      header: "Equipment Name",
      accessorKey: "name",
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) =>
        row.original.updatedAt ? formatDate(row.original.updatedAt) : "-",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) =>
        row.original.createdAt ? formatDate(row.original.createdAt) : "-",
    },
    // Only show actions column if user has permissions
    ...(canUpdate || canDelete
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => {
              const { id } = row.original;

              if (!canUpdate && !canDelete) return null;

              return (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    {canUpdate && (
                      <DropdownMenuItem
                        onClick={() => {
                          setUpdateModalOpen(true);
                          setSelectedEquipment(row.original);
                        }}
                      >
                        <Pencil />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    )}

                    {canDelete && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setEquipmentId(id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Equipment</h1>
        {canCreate && (
          <Button onClick={() => setAddEquipmentModalOpen(true)}>
            <Plus />
            <span>Add Equipment</span>
          </Button>
        )}
      </div>
      <div className="rounded-xl border bg-card p-6">
        {/* Filters */}
        <div className="mb-6">
          <TableFilters
            config={{
              showSearch: true,
              searchPlaceholder: "Search by name...",
              sortOptions: [
                { field: "createdAt", label: "Created Date" },
                { field: "updatedAt", label: "Updated Date" },
                { field: "name", label: "Name" },
              ],
            }}
            values={filters}
            onChange={setFilters}
          />
        </div>

        <DataTable
          data={data}
          columns={columns}
          isPending={isValidating}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Equipment Creation Modal */}
      <Modal
        isOpen={addEquipmentModalOpen}
        onClose={() => setAddEquipmentModalOpen(false)}
        title="Add Equipment"
        isPending={addEquipmentForm.formState.isSubmitting}
      >
        <Form {...addEquipmentForm}>
          <form onSubmit={addEquipmentForm.handleSubmit(handleAddEquipment)}>
            <FormFieldset disabled={addEquipmentForm.formState.isSubmitting}>
              <FormField
                control={addEquipmentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Equipment Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setAddEquipmentModalOpen(false);
                    addEquipmentForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={addEquipmentForm.formState.isSubmitting}
                >
                  Add
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Delete Equipment Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Equipment"
        isPending={deleteForm.formState.isSubmitting}
      >
        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(handleDeleteEquipment)}>
            <FormFieldset disabled={deleteForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                equipment and remove associated data.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={deleteForm.formState.isSubmitting}
                >
                  Continue
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>
      <UpdateEquipments
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedEquipment(null);
        }}
        equipment={selectedEquipment}
        url={url}
      />
    </>
  );
};

export default EquipmentsTable;
