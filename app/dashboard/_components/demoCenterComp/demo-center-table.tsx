"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { demoCenterAdmin } from "@/lib/admin/demoCenter";
import { DemoCenter } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Eye, Globe, Lock, MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import UpdateDemoCenter from "./UpdateDemoCenter";

export const DemoCenterTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockDemoCenterModalOpen, setBlockDemoCenterModalOpen] =
    useState(false);
  const [unblockDemoCenterModalOpen, setUnblockDemoCenterModalOpen] =
    useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [demoCenterId, setDemoCenterId] = useState<string | undefined>("");
  const [selectedDemoCenter, setSelectedDemoCenter] =
    useState<DemoCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Get demo centers data with search
  const url = `/api/demo-centers/dashboard?page=${pagination.pageIndex}&limit=${pagination.pageSize}${searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : ""}`;
  const { isValidating, data } = useSWR(url);

  // Block Demo Center Form
  const blockDemoCenterForm = useForm({
    defaultValues: {
      blockReason: "",
    },
  });

  // Handle Demo Center blocking
  const handleBlockDemoCenter = async (formData: { blockReason: string }) => {
    if (!demoCenterId) {
      toast.error("Demo center ID is required");
      return;
    }

    try {
      const { error } = await demoCenterAdmin.block({
        demoCenterId,
        blockReason: formData.blockReason,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Demo center blocked successfully");
      setBlockDemoCenterModalOpen(false);
      blockDemoCenterForm.reset();
      mutate(url);
    } catch {
      toast.error("Failed to block demo center");
    }
  };

  // Unblock Demo Center Form
  const unblockDemoCenterForm = useForm();
  const handleUnblockDemoCenter = async () => {
    if (!demoCenterId) {
      toast.error("Demo center ID is required");
      return;
    }

    try {
      const { error } = await demoCenterAdmin.unblock({
        demoCenterId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Demo center unblocked successfully");
      setUnblockDemoCenterModalOpen(false);
      mutate(url);
    } catch {
      toast.error("Failed to unblock demo center");
    }
  };

  // Publish/Unpublish Demo Center
  const handlePublishToggle = async (isPublic: boolean) => {
    if (!demoCenterId) {
      toast.error("Demo center ID is required");
      return;
    }

    try {
      const { error } = await demoCenterAdmin.updateStatus({
        demoCenterId,
        isPublic: isPublic,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        isPublic
          ? "Demo center published successfully"
          : "Demo center unpublished successfully",
      );
      setPublishModalOpen(false);
      mutate(url);
    } catch {
      toast.error("Failed to update demo center status");
    }
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle Demo Center Deletion
  const handleDeleteDemoCenter = async () => {
    if (!demoCenterId) {
      toast.error("Demo center ID is required");
      return;
    }

    try {
      const { error, data } = await demoCenterAdmin.delete({
        demoCenterId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success("Demo center deleted successfully");
      }

      setDeleteModalOpen(false);
      deleteForm.reset();
      mutate(url);
    } catch {
      toast.error("Failed to delete demo center");
    }
  };

  // Table columns
  const columns: ColumnDef<DemoCenter>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Building Type",
      accessorKey: "buildingType",
    },
    {
      header: "Contact",
      accessorKey: "contact",
    },

    {
      header: "Published",
      accessorKey: "isPublic",
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {row.original.isPublic ? (
              <Badge
                variant="success"
                className="inline-flex items-center gap-1"
              >
                <Globe className="size-3" />
                Published
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1"
              >
                <Lock className="size-3" />
                Private
              </Badge>
            )}
          </div>
        );
      },
    },
    // {
    //   header: "Blocked Status",
    //   accessorKey: "blocked",
    //   cell: ({ row }) => {
    //     return row.original.blocked ? (
    //       <Badge variant="destructive">Blocked</Badge>
    //     ) : (
    //       <Badge variant="secondary">Active</Badge>
    //     );
    //   },
    // },
    // {
    //   header: "Block Reason",
    //   accessorKey: "blockReason",
    //   cell: ({ row }) => {
    //     return row.original.blockReason ? (
    //       <div className="max-w-xs truncate" title={row.original.blockReason}>
    //         {row.original.blockReason}
    //       </div>
    //     ) : (
    //       <span className="text-muted-foreground">-</span>
    //     );
    //   },
    // },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    // {
    //   header: "Updated At",
    //   accessorKey: "updatedAt",
    //   cell: ({ row }) => formatDate(row.original.updatedAt),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, blocked, isPublic } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/demo-centers/${id}`}>
                    <Eye />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  onClick={() => {
                    setSelectedDemoCenter(row.original);
                    setUpdateModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => {
                    setDemoCenterId(id);
                    setPublishModalOpen(true);
                  }}
                >
                  {isPublic ? (
                    <>
                      <Lock />
                      <span>Make Private</span>
                    </>
                  ) : (
                    <>
                      <Globe />
                      <span>Publish</span>
                    </>
                  )}
                </DropdownMenuItem>
                {/* {blocked ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setDemoCenterId(id);
                      setUnblockDemoCenterModalOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>Unblock</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setDemoCenterId(id);
                      setBlockDemoCenterModalOpen(true);
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    <span>Block</span>
                  </DropdownMenuItem>
                )} */}
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/demo-centers/${id}/edit`}>
                    <Pencil />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setDemoCenterId(id);
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
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl font-medium">Demo Centers</h1>
          </div>

          {/* <div className="relative max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search demo centers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
        </div>
        <DataTable
          data={data}
          columns={columns}
          isPending={isValidating}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Publish/Unpublish Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publish Demo Center"
        isPending={false}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Choose whether to publish this demo center to make it visible on the
            public page, or keep it private for admin use only.
          </p>
          <div className="flex justify-end gap-3 py-5">
            <Button
              type="button"
              onClick={() => setPublishModalOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handlePublishToggle(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Globe />
              Publish
            </Button>
            <Button
              onClick={() => handlePublishToggle(false)}
              variant="outline"
            >
              <Lock />
              Make Private
            </Button>
          </div>
        </div>
      </Modal>

      {/* Block Demo Center Modal */}
      <Modal
        isOpen={blockDemoCenterModalOpen}
        onClose={() => setBlockDemoCenterModalOpen(false)}
        title="Block Demo Center"
        isPending={blockDemoCenterForm.formState.isSubmitting}
      >
        <Form {...blockDemoCenterForm}>
          <form
            onSubmit={blockDemoCenterForm.handleSubmit(handleBlockDemoCenter)}
          >
            <FormFieldset disabled={blockDemoCenterForm.formState.isSubmitting}>
              <p className="mb-5 text-muted-foreground">
                This will block the demo center and prevent it from being
                displayed publicly.
              </p>
              <FormField
                control={blockDemoCenterForm.control}
                name="blockReason"
                rules={{ required: "Block reason is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter block reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setBlockDemoCenterModalOpen(false);
                    blockDemoCenterForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={blockDemoCenterForm.formState.isSubmitting}
                >
                  Block Demo Center
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Unblock Demo Center Modal */}
      <Modal
        isOpen={unblockDemoCenterModalOpen}
        onClose={() => setUnblockDemoCenterModalOpen(false)}
        title="Unblock Demo Center"
        isPending={unblockDemoCenterForm.formState.isSubmitting}
      >
        <Form {...unblockDemoCenterForm}>
          <form
            onSubmit={unblockDemoCenterForm.handleSubmit(
              handleUnblockDemoCenter,
            )}
          >
            <FormFieldset
              disabled={unblockDemoCenterForm.formState.isSubmitting}
            >
              <p className="mb-5 text-muted-foreground">
                This will unblock the demo center and allow it to be displayed
                publicly again.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setUnblockDemoCenterModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={unblockDemoCenterForm.formState.isSubmitting}
                >
                  Unblock Demo Center
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Delete Demo Center Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Demo Center"
        isPending={deleteForm.formState.isSubmitting}
      >
        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(handleDeleteDemoCenter)}>
            <FormFieldset disabled={deleteForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                demo center and remove associated data.
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
                  Delete Demo Center
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Update Demo Center Modal */}
      <UpdateDemoCenter
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedDemoCenter(null);
        }}
        demoCenter={selectedDemoCenter}
        onUpdate={() => {
          mutate(url);
        }}
      />
    </>
  );
};
