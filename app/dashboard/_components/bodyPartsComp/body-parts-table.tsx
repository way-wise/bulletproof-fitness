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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";
import UpdatesBodyParts from "./UpdatesBodyParts";

type TBodyPart = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

const BodyPartsTable = () => {
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

  // Get equipments data
  const url = `/api/body-parts?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
  const { isValidating, data } = useSWR(url);

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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => {
                    setUpdateBodyPartModalOpen(true);
                    setSelectedBodyPart(row.original);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>

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
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Body Parts</h1>
        <Button onClick={() => setAddBodyPartModalOpen(true)}>
          <Plus />
          <span>Add Body Part</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input type="search" placeholder="Search..." className="max-w-xs" />
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
