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
import { bodyPartSchema } from "@/schema/bodyparts";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";
import UpdatesBodyParts from "./UpdatesBodyParts";
import { TableFilters, FilterValues } from "../shared/TableFilters";
import { useSessionWithPermissions } from "@/hooks/useSessionWithPermissions";

type TBodyPart = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

const BodyPartsTable = () => {
  const { data: session } = useSessionWithPermissions();

  const hasPermission = (action: string) => {
    if (!session?.user) return false;
    if (session.user.role === "admin") return true;
    const user = session.user as any;
    return user.permissions?.some(
      (p: any) => p.resource === "bodyPart" && p.action === action
    ) || false;
  };

  const canCreate = hasPermission("create");
  const canUpdate = hasPermission("update");
  const canDelete = hasPermission("delete");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addBodyPartModalOpen, setAddBodyPartModalOpen] = useState(false);
  const [updateBodyPartModalOpen, setUpdateBodyPartModalOpen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<TBodyPart | null>(
    null,
  );
  const [bodyPartId, setBodyPartId] = useState<string | undefined>("");
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

    return `/api/body-parts?${params.toString()}`;
  };

  const url = buildUrl();
  const { isValidating, data} = useSWR(url);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, [filters]);

  // Add Equipment Form
  const addBodyPartForm = useForm({
    resolver: yupResolver(bodyPartSchema),
    defaultValues: {
      name: "",
    },
  });

  // Handle Add Equipment
  const handleAddBodyPart = async (
    values: InferType<typeof bodyPartSchema>,
  ) => {
    try {
      const response = await fetch("/api/body-parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create body part");
      }

      toast.success("Body Part added successfully");
      setAddBodyPartModalOpen(false);
      addBodyPartForm.reset();
      mutate(url);
    } catch (error) {
      setAddBodyPartModalOpen(false);
      addBodyPartForm.reset();
      toast.error(
        error instanceof Error ? error.message : "Failed to create body part",
      );
    }
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle Equipment Deletion
  const handleDeleteBodyPart = async () => {
    try {
      const response = await fetch(`/api/body-parts/${bodyPartId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete body part");
      }

      toast.success("Body Part deleted successfully");
      setDeleteModalOpen(false);
      mutate(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete body part",
      );
    }
  };

  // Table columns
  const columns: ColumnDef<TBodyPart>[] = [
    {
      header: "Body Part Name",
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
                          setUpdateBodyPartModalOpen(true);
                          setSelectedBodyPart(row.original);
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
                          setBodyPartId(id);
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
        <h1 className="text-2xl font-medium">Body Parts</h1>
        {canCreate && (
          <Button onClick={() => setAddBodyPartModalOpen(true)}>
            <Plus />
            <span>Add Body Part</span>
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

      {/* Body Part Creation Modal */}
      <Modal
        isOpen={addBodyPartModalOpen}
        onClose={() => setAddBodyPartModalOpen(false)}
        title="Add Body Part"
        isPending={addBodyPartForm.formState.isSubmitting}
      >
        <Form {...addBodyPartForm}>
          <form onSubmit={addBodyPartForm.handleSubmit(handleAddBodyPart)}>
            <FormFieldset disabled={addBodyPartForm.formState.isSubmitting}>
              <FormField
                control={addBodyPartForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Part Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Body Part Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setAddBodyPartModalOpen(false);
                    addBodyPartForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={addBodyPartForm.formState.isSubmitting}
                >
                  Add
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Delete Body Part Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Body Part"
        isPending={deleteForm.formState.isSubmitting}
      >
        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(handleDeleteBodyPart)}>
            <FormFieldset disabled={deleteForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                body part and remove associated data.
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

      <UpdatesBodyParts
        isOpen={updateBodyPartModalOpen}
        onClose={() => {
          setUpdateBodyPartModalOpen(false);
          setSelectedBodyPart(null);
        }}
        bodyPart={selectedBodyPart}
        url={url}
      />
    </>
  );
};

export default BodyPartsTable;
