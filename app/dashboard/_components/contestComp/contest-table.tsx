"use client";

import { useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mutate } from "swr";
import { useContests } from "@/hooks/useContest";
import { format } from "date-fns";
import CreateContestForm from "./CreateContestForm";
import UpdateContestForm from "./UpdateContestForm";

interface ContestCard {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  order: number;
  cardType?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContestSection {
  id: string;
  contestId: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  isVisible: boolean;
  cards: ContestCard[];
  createdAt: string;
  updatedAt: string;
}

interface Contest {
  id: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  sections: ContestSection[];
  createdAt: string;
  updatedAt: string;
}

export const ContestTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const { contests, isLoading } = useContests();

  // Handle Delete Contest
  const handleDeleteContest = async () => {
    if (!selectedContest) return;

    try {
      const response = await fetch(`/api/contest/${selectedContest.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        mutate("/api/contest/admin");
        setDeleteModalOpen(false);
        setSelectedContest(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting contest:", error);
      toast.error("Failed to delete contest");
    }
  };

  // Handle Toggle Contest Status
  const handleToggleStatus = async (contest: Contest) => {
    try {
      const response = await fetch(`/api/contest/${contest.id}/toggle`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        mutate("/api/contest/admin");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling contest status:", error);
      toast.error("Failed to toggle contest status");
    }
  };

  const columns: ColumnDef<Contest, unknown>[] = [
    {
      accessorKey: "id",
      header: "Contest",
      cell: ({ row }) => {
        const heroSection = row.original.sections.find(s => s.sectionType === "hero");
        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">
              {heroSection?.title || `Contest ${row.original.id.slice(-8)}`}
            </div>
            {heroSection?.subtitle && (
              <div className="text-sm text-muted-foreground truncate">
                {heroSection.subtitle}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "sections",
      header: "Sections",
      cell: ({ row }) => (
        <div className="max-w-[300px] text-sm text-muted-foreground">
          {row.original.sections.length} sections
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = row.getValue("startDate") as string;
        return startDate ? format(new Date(startDate), "MMM dd, yyyy") : "—";
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const endDate = row.getValue("endDate") as string;
        return endDate ? format(new Date(endDate), "MMM dd, yyyy") : "—";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return format(new Date(date), "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const contest = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedContest(contest);
                  setUpdateModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleStatus(contest)}
              >
                <Power className="mr-2 h-4 w-4" />
                {contest.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedContest(contest);
                  setDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Contest Management</h1>
        {/* <Button onClick={() => setCreateModalOpen(true)}>
          <Plus />
          <span>Create Contest</span>
        </Button> */}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <DataTable
          data={{ data: contests, meta: { total: contests.length, page: pagination.pageIndex, limit: pagination.pageSize } }}
          columns={columns}
          isPending={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Create Contest Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="w-full max-w-7xl h-[90vh] overflow-hidden sm:max-w-7xl lg:max-w-8xl xl:max-w-9xl flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Contest</DialogTitle>
          </DialogHeader>
          <CreateContestForm
            onSuccess={() => {
              setCreateModalOpen(false);
              mutate("/api/contest/admin");
            }}
            onCancel={() => setCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Update Contest Modal */}
      <Dialog 
        open={updateModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setUpdateModalOpen(false);
            setSelectedContest(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-7xl h-[90vh] overflow-hidden sm:max-w-7xl lg:max-w-8xl xl:max-w-9xl flex flex-col">
          <DialogHeader>
            <DialogTitle>Update Contest</DialogTitle>
          </DialogHeader>
          {selectedContest && (
            <UpdateContestForm
              contest={selectedContest}
              onSuccess={() => {
                setUpdateModalOpen(false);
                setSelectedContest(null);
                mutate("/api/contest/admin");
              }}
              onCancel={() => {
                setUpdateModalOpen(false);
                setSelectedContest(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedContest(null);
        }}
        title="Delete Contest"
        isPending={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{selectedContest?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedContest(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContest}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContestTable;
