"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Pencil, Shield, ShieldAlert } from "lucide-react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

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
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
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
      cell: ({ row }) => (
        <div className="text-right">
          <Link href={`/dashboard/roles/${row.original.name}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      ),
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
    <DataTable
      columns={columns}
      data={paginatedData}
      isPending={false}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}
