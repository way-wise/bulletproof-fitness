"use client";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { admin } from "@/lib/auth-client";
import { YouTubeVideo } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  Ban,
  Eye,
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Play,
  Search,
  Trash,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export const YouTubeVideoTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockVideoModalOpen, setBlockVideoModalOpen] = useState(false);
  const [unblockVideoModalOpen, setUnblockVideoModalOpen] = useState(false);
  const [publishVideoModalOpen, setPublishVideoModalOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | undefined>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Get YouTube videos data with search
  const url = `/api/youtube-videos?page=${pagination.pageIndex}&limit=${pagination.pageSize}&search=${encodeURIComponent(searchQuery)}`;
  const { isValidating, data } = useSWR(url);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      const { error } = await admin.blockYouTubeVideo({
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
    } catch (error) {
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
      const { error } = await admin.unblockYouTubeVideo({
        videoId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Video unblocked successfully");
      setUnblockVideoModalOpen(false);
      mutate(url);
    } catch (error) {
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
      const { error } = await admin.updateYouTubeVideoStatus({
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
    } catch (error) {
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
      const { error, data } = await admin.deleteYouTubeVideo({
        videoId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.success) {
        toast.success("Video deleted successfully");
      }

      setDeleteModalOpen(false);
      deleteVideoForm.reset();
      mutate(url);
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  // Get status badge for video
  const getStatusBadge = (video: YouTubeVideo) => {
    if (video.blocked) {
      return <Badge variant="destructive">Blocked</Badge>;
    }
    if (!video.isPublic) {
      return <Badge variant="secondary">Private</Badge>;
    }
    return <Badge variant="success">Published</Badge>;
  };

  // Table columns
  const columns: ColumnDef<YouTubeVideo>[] = [
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
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.title}>
          {row.original.title}
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Privacy",
      accessorKey: "privacy",
      cell: ({ row }) => {
        const privacy = row.original.privacy;
        return (
          <Badge variant={privacy === "public" ? "success" : "secondary"}>
            {privacy}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "uploaded"
                ? "success"
                : status === "processing"
                  ? "secondary"
                  : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Views",
      accessorKey: "viewCount",
      cell: ({ row }) => row.original.viewCount.toLocaleString(),
    },
    {
      header: "Likes",
      accessorKey: "likeCount",
      cell: ({ row }) => row.original.likeCount.toLocaleString(),
    },
    {
      header: "Published",
      accessorKey: "isPublic",
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.isPublic ? (
              <Badge variant="success" className="flex items-center gap-1">
                <Globe className="size-3" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="size-3" />
                Private
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Blocked Status",
      accessorKey: "blocked",
      cell: ({ row }) => {
        return row.original.blocked ? (
          <Badge variant="destructive">Blocked</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        );
      },
    },
    {
      header: "Block Reason",
      accessorKey: "blockReason",
      cell: ({ row }) => {
        return row.original.blockReason ? (
          <div className="max-w-xs truncate" title={row.original.blockReason}>
            {row.original.blockReason}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      header: "Upload Date",
      accessorKey: "uploadDate",
      cell: ({ row }) => formatDate(row.original.uploadDate),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, blocked, isPublic, videoUrl } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    <span>Watch</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/youtube-videos/${id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
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
                {blocked ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setVideoId(id);
                      setUnblockVideoModalOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>Unblock</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setVideoId(id);
                      setBlockVideoModalOpen(true);
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    <span>Block</span>
                  </DropdownMenuItem>
                )}
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
          <div className="relative max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
    </>
  );
};
