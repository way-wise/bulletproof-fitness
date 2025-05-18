"use client";

import type { User } from "@/schema/userSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { PaginatedData } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UsersTable = ({ data }: { data: PaginatedData<User> }) => {
  // Table columns
  const columns: ColumnDef<User>[] = [
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
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => row.original.name,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => row.original.email,
    },
    {
      header: () => <div className="flex items-center justify-center">Email Verified</div>,
      accessorKey: "emailVerified",
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.emailVerified ? (
              <Badge variant="success" size="icon">
                <Check className="size-4" />
              </Badge>
            ) : (
              <Badge variant="destructive" size="icon">
                <X className="size-4" />
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        return row.original.role === "admin" ? (
          <Badge variant="success">Admin</Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        );
      },
    },
    {
      header: "Banned",
      accessorKey: "banned",
      cell: ({ row }) => {
        return row.original.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="secondary">Not Banned</Badge>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="align-middle">
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash />
                <span>Delete</span>
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
        <hgroup>
          <h1 className="text-2xl font-medium">Users</h1>
          <p className="text-muted-foreground">
            Manage your users and their roles.
          </p>
        </hgroup>
        <Button>
          <Plus />
          <span>Add User</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input type="search" placeholder="Search..." className="max-w-xs" />
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  );
};
