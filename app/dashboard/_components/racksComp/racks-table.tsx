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
import { rackSchema } from "@/schema/rackSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";
import UpdateRacks from "./UpdateRacks";

type TRack = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

const RacksTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addRackModalOpen, setAddRackModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rackId, setRackId] = useState<string | undefined>("");
  const [selectedRack, setSelectedRack] = useState<TRack | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Get racks data
  const url = `/api/racks?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
  const { isValidating, data } = useSWR(url);

  // Add Rack Form
  const addRackForm = useForm({
    resolver: yupResolver(rackSchema),
    defaultValues: {
      name: "",
    },
  });

  // Handle Add Rack
  const handleAddRack = async (values: InferType<typeof rackSchema>) => {
    try {
      const response = await fetch("/api/racks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create rack");
      }

      toast.success("Rack added successfully");
      setAddRackModalOpen(false);
      addRackForm.reset();
      mutate(url);
    } catch (error) {
      setAddRackModalOpen(false);
      addRackForm.reset();
      toast.error(
        error instanceof Error ? error.message : "Failed to create rack",
      );
    }
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle Equipment Deletion
  const handleDeleteRack = async () => {
    try {
      const response = await fetch(`/api/racks/${rackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete rack");
      }

      toast.success("Rack deleted successfully");
      setDeleteModalOpen(false);
      mutate(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete rack",
      );
    }
  };

  // Table columns
  const columns: ColumnDef<TRack>[] = [
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
      header: "Rack Name",
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
                    setSelectedRack(row.original);
                    setUpdateModalOpen(true);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setRackId(id);
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
        <h1 className="text-2xl font-medium">Racks</h1>
        <Button onClick={() => setAddRackModalOpen(true)}>
          <Plus />
          <span>Add Rack</span>
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
        isOpen={addRackModalOpen}
        onClose={() => setAddRackModalOpen(false)}
        title="Add Rack"
        isPending={addRackForm.formState.isSubmitting}
      >
        <Form {...addRackForm}>
          <form onSubmit={addRackForm.handleSubmit(handleAddRack)}>
            <FormFieldset disabled={addRackForm.formState.isSubmitting}>
              <FormField
                control={addRackForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rack Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rack Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setAddRackModalOpen(false);
                    addRackForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={addRackForm.formState.isSubmitting}
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
        title="Delete Rack"
        isPending={deleteForm.formState.isSubmitting}
      >
        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(handleDeleteRack)}>
            <FormFieldset disabled={deleteForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                rack and remove associated data.
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

      {/* Update Rack Modal */}
      <UpdateRacks
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedRack(null);
        }}
        rack={selectedRack}
        url={url}
      />
    </>
  );
};

export default RacksTable;
