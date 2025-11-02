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
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { exerciseLibraryAdmin } from "@/lib/admin/exerciseLibrary";
import { ExerciseLibraryVideo } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  Eye,
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import LibraryVideoUpload from "./create-ex-lib-admin";
import UpdateLibraryVideo from "./UpdateLibraryVideo";
import { TableFilters, FilterValues } from "../shared/TableFilters";
import { useBodyParts } from "@/hooks/useBodyParts";
import { useEquipments } from "@/hooks/useEquipments";
import { useRacks } from "@/hooks/useRacks";
import { useSessionWithPermissions } from "@/hooks/useSessionWithPermissions";

export const ExerciseLibraryVideoTable = () => {
  const { data: session } = useSessionWithPermissions();

  const hasPermission = (action: string) => {
    if (!session?.user) return false;
    if (session.user.role === "admin") return true;
    const user = session.user as any;
    return user.permissions?.some(
      (p: any) => p.resource === "exerciseLibrary" && p.action === action
    ) || false;
  };

  const canCreate = hasPermission("create");
  const canUpdate = hasPermission("update");
  const canDelete = hasPermission("delete");
  const canChangeStatus = hasPermission("status");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockVideoModalOpen, setBlockVideoModalOpen] = useState(false);
  const [unblockVideoModalOpen, setUnblockVideoModalOpen] = useState(false);
  const [publishVideoModalOpen, setPublishVideoModalOpen] = useState(false);
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [updateExerciseModalOpen, setUpdateExerciseModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videoId, setVideoId] = useState<string | undefined>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    bodyPartIds: [],
    equipmentIds: [],
    rackIds: [],
    isPublic: [],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch filter options
  const { bodyParts } = useBodyParts();
  const { equipments } = useEquipments();
  const { racks } = useRacks();

  // Build URL with all filters
  const buildUrl = () => {
    const params = new URLSearchParams({
      page: pagination.pageIndex.toString(),
      limit: pagination.pageSize.toString(),
    });

    if (filters.search) params.append("search", filters.search);
    if (Array.isArray(filters.bodyPartIds) && filters.bodyPartIds.length > 0) {
      params.append("bodyPartIds", filters.bodyPartIds.join(","));
    }
    if (Array.isArray(filters.equipmentIds) && filters.equipmentIds.length > 0) {
      params.append("equipmentIds", filters.equipmentIds.join(","));
    }
    if (Array.isArray(filters.rackIds) && filters.rackIds.length > 0) {
      params.append("rackIds", filters.rackIds.join(","));
    }
    if (Array.isArray(filters.isPublic) && filters.isPublic.length > 0) {
      params.append("isPublic", filters.isPublic[0]);
    }
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return `/api/exercise-library/dashboard?${params.toString()}`;
  };

  const url = buildUrl();
  const { isValidating, data } = useSWR(url);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, [filters]);

  // Block Video Form
  const blockVideoForm = useForm<{ blockReason: string }>({
    defaultValues: {
      blockReason: "",
    },
  });

  // Handle Video blocking
  const handleBlockVideo = async (formData: { blockReason: string }) => {
    if (!videoId) {
      toast.error("Video ID is required");
      return;
    }

    try {
      const { error } = await exerciseLibraryAdmin.block({
        videoId,
        blockReason: formData.blockReason,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Video blocked successfully");
      setBlockVideoModalOpen(false);
      blockVideoForm.reset();
      mutate(url);
    } catch {
      toast.error("Failed to block video");
    }
  };

  // Unblock Video Form
  const unblockVideoForm = useForm();
  const handleUnblockVideo = async () => {
    if (!videoId) {
      toast.error("Video ID is required");
      return;
    }

    try {
      const { error } = await exerciseLibraryAdmin.unblock({
        videoId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Video unblocked successfully");
      setUnblockVideoModalOpen(false);
      mutate(url);
    } catch {
      toast.error("Failed to unblock video");
    }
  };

  // Publish/Unpublish Video
  const handlePublishVideoToggle = async (isPublic: boolean) => {
    if (!videoId) {
      toast.error("Video ID is required");
      return;
    }

    try {
      const { error } = await exerciseLibraryAdmin.updateStatus({
        videoId,
        isPublic: isPublic,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        isPublic
          ? "Video published successfully"
          : "Video unpublished successfully",
      );
      setPublishVideoModalOpen(false);
      mutate(url);
    } catch {
      toast.error("Failed to update video status");
    }
  };

  // Delete Form
  const deleteVideoForm = useForm();

  // Handle Video Deletion
  const handleDeleteVideo = async () => {
    if (!videoId) {
      toast.error("Video ID is required");
      return;
    }

    try {
      const { error } = await exerciseLibraryAdmin.delete({
        videoId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Video deleted successfully");

      setDeleteModalOpen(false);
      deleteVideoForm.reset();
      mutate(url);
    } catch {
      toast.error("Failed to delete video");
    }
  };

  // Table columns
  const columns: ColumnDef<ExerciseLibraryVideo>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.title}>
          {row.original.title}
        </div>
      ),
    },
    {
      header: "Equipment",
      accessorKey: "equipment",
      cell: ({ row }) => {
        const equipmentArray = row.original.ExLibEquipment;

        if (!Array.isArray(equipmentArray) || equipmentArray.length === 0)
          return "-";
        return (
          <div className="flex flex-wrap gap-1">
            {equipmentArray.slice(0, 2).map((item, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item?.equipment?.name}
              </Badge>
            ))}
            {equipmentArray.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{equipmentArray.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Body Part",
      accessorKey: "bodyPart",
      cell: ({ row }) => {
        const bodyPartArray = row.original.ExLibBodyPart;

        if (!Array.isArray(bodyPartArray) || bodyPartArray.length === 0)
          return "-";

        return (
          <div className="flex flex-wrap gap-1">
            {bodyPartArray.slice(0, 2).map((item, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item?.bodyPart?.name}
              </Badge>
            ))}
            {bodyPartArray.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{bodyPartArray.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Height",
      accessorKey: "height",
      cell: ({ row }) => row.original.height || "-",
    },
    {
      header: "Rack",
      accessorKey: "rack",
      cell: ({ row }) => {
        const rackArray = row.original.ExLibRak;

        if (!Array.isArray(rackArray) || rackArray.length === 0) return "-";

        return (
          <div className="flex flex-wrap gap-1">
            {rackArray.slice(0, 2).map((item, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item?.rack?.name}
              </Badge>
            ))}
            {rackArray.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{rackArray.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
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

    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    // Always show actions column because View is always available
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, blocked, isPublic, videoUrl } = row.original;

        return (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/exercise-library/${id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </DropdownMenuItem>
                    {canUpdate && (
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedVideo(row.original);
                          setUpdateExerciseModalOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    )}
                    {canChangeStatus && (
                      <DropdownMenuItem
                        onClick={() => {
                          setVideoId(id);
                          setPublishVideoModalOpen(true);
                        }}
                      >
                        {isPublic ? (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            <span>Make Private</span>
                          </>
                        ) : (
                          <>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Publish</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setVideoId(id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Exercise Library Videos
        </h1>
        {canCreate && (
          <Button onClick={() => setAddExerciseModalOpen(true)}>
            <Plus />
            <span>Add Exercise Video</span>
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        {/* Filters */}
        <div className="mb-6">
          <TableFilters
            config={{
              showSearch: true,
              searchPlaceholder: "Search by title, equipment, body part, or rack...",
              multiSelects: [
                {
                  key: "bodyPartIds",
                  label: "Body Parts",
                  placeholder: "Filter by body parts",
                  options: bodyParts.map((bp) => ({
                    value: bp.id,
                    label: bp.name,
                  })),
                },
                {
                  key: "equipmentIds",
                  label: "Equipment",
                  placeholder: "Filter by equipment",
                  options: equipments.map((eq) => ({
                    value: eq.id,
                    label: eq.name,
                  })),
                },
                {
                  key: "rackIds",
                  label: "Racks",
                  placeholder: "Filter by racks",
                  options: racks.map((r) => ({
                    value: r.id,
                    label: r.name,
                  })),
                },
                {
                  key: "isPublic",
                  label: "Status",
                  placeholder: "Filter by status",
                  options: [
                    { value: "true", label: "Published" },
                    { value: "false", label: "Private" },
                  ],
                },
              ],
              sortOptions: [
                { field: "createdAt", label: "Created Date" },
                { field: "updatedAt", label: "Updated Date" },
                { field: "title", label: "Title" },
                { field: "height", label: "Height" },
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

      {/* Publish/Unpublish Modal */}
      <Modal
        isOpen={publishVideoModalOpen}
        onClose={() => setPublishVideoModalOpen(false)}
        title="Publish Video"
        isPending={false}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Choose whether to publish this video to make it visible on the
            public page, or keep it private for admin use only.
          </p>
          <div className="flex justify-end gap-3 py-5">
            <Button
              type="button"
              onClick={() => setPublishVideoModalOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handlePublishVideoToggle(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Globe className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <Button
              onClick={() => handlePublishVideoToggle(false)}
              variant="outline"
            >
              <Lock className="mr-2 h-4 w-4" />
              Make Private
            </Button>
          </div>
        </div>
      </Modal>

      {/* Block Video Modal */}
      <Modal
        isOpen={blockVideoModalOpen}
        onClose={() => setBlockVideoModalOpen(false)}
        title="Block Video"
        isPending={blockVideoForm.formState.isSubmitting}
      >
        <Form {...blockVideoForm}>
          <form onSubmit={blockVideoForm.handleSubmit(handleBlockVideo)}>
            <FormFieldset disabled={blockVideoForm.formState.isSubmitting}>
              <p className="mb-5 text-muted-foreground">
                This will block the video and prevent it from being displayed
                publicly.
              </p>
              <FormField
                control={blockVideoForm.control}
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
                    setBlockVideoModalOpen(false);
                    blockVideoForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={blockVideoForm.formState.isSubmitting}
                >
                  Block Video
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Unblock Video Modal */}
      <Modal
        isOpen={unblockVideoModalOpen}
        onClose={() => setUnblockVideoModalOpen(false)}
        title="Unblock Video"
        isPending={unblockVideoForm.formState.isSubmitting}
      >
        <Form {...unblockVideoForm}>
          <form onSubmit={unblockVideoForm.handleSubmit(handleUnblockVideo)}>
            <FormFieldset disabled={unblockVideoForm.formState.isSubmitting}>
              <p className="mb-5 text-muted-foreground">
                This will unblock the video and allow it to be displayed
                publicly again.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setUnblockVideoModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={unblockVideoForm.formState.isSubmitting}
                >
                  Unblock Video
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>
      {/* Exercise Creation Modal */}
      <Dialog
        open={addExerciseModalOpen}
        onClose={() => setAddExerciseModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/75" />
        <div className="fixed inset-0 flex size-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl rounded-lg bg-card shadow-xl">
            <div className="flex justify-between gap-3 border-b p-5">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">Upload Exercise Video</p>
              </div>
              <Button
                type="button"
                onClick={() => setAddExerciseModalOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-5">
              <LibraryVideoUpload
                setAddExerciseModalOpen={setAddExerciseModalOpen}
                mutateUrl={url}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      {/* Delete Video Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Video"
        isPending={deleteVideoForm.formState.isSubmitting}
      >
        <Form {...deleteVideoForm}>
          <form onSubmit={deleteVideoForm.handleSubmit(handleDeleteVideo)}>
            <FormFieldset disabled={deleteVideoForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                video and remove associated data.
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
                  isLoading={deleteVideoForm.formState.isSubmitting}
                >
                  Delete Video
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>
      {/* Update Exercise Modal */}
      {selectedVideo && (
        <UpdateLibraryVideo
          video={selectedVideo}
          isOpen={updateExerciseModalOpen}
          onClose={() => {
            setUpdateExerciseModalOpen(false);
            setSelectedVideo(null);
          }}
          mutateUrl={url}
        />
      )}
    </>
  );
};
