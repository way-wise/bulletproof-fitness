"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Pencil, Shield, ShieldAlert, Trash2, Loader2 } from "lucide-react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  rolePermissions: Array<{
    permission: {
      id: string;
      resource: string;
      action: string;
    };
  }>;
}

export function RolesTable({ roles }: { roles: Role[] }) {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!roleToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/roles/${roleToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Role deleted successfully");
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete role");
      }
    } catch (error) {
      toast.error("Failed to delete role");
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
            {role.isSystem ? (
              <ShieldAlert className="h-4 w-4 text-orange-500" />
            ) : (
              <Shield className="h-4 w-4 text-blue-500" />
            )}
            <div className="font-medium capitalize">{role.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
          {row.original.description || "No description"}
        </p>
      ),
    },
    {
      accessorKey: "rolePermissions",
      header: "Permissions",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.rolePermissions.length} permissions
        </Badge>
      ),
    },
    {
      accessorKey: "isSystem",
      header: "Type",
      cell: ({ row }) =>
        row.original.isSystem ? (
          <Badge variant="secondary">System</Badge>
        ) : (
          <Badge>Custom</Badge>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const role = row.original;
        const isSystemRole = role.isSystem;

        return (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/dashboard/roles/${role.name}`}>
              <Button variant="secondary" size="sm">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>

            {!isSystemRole && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setRoleToDelete(role.name);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Transform roles data to match PaginatedData format
  const paginatedData = {
    data: roles,
    meta: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      total: roles.length,
      totalPages: Math.ceil(roles.length / pagination.pageSize),
    },
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        isPending={false}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* Delete Role Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!deleting) {
            setDeleteDialogOpen(open);
            if (!open) setRoleToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{roleToDelete}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
