"use client";

import type { User } from "@/schema/userSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PaginatedData } from "@/lib/dataTypes";

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
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "emailVerified", header: "Email Verified" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "banned", header: "Banned" },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "updatedAt", header: "Updated At" },
  ];

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between gap-4 pb-6">
        <Input type="search" placeholder="Search..." className="max-w-xs" />
        <Button>
          <Plus />
          <span>Add User</span>
        </Button>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
