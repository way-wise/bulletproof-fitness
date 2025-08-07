"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date-format";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

type Feedback = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

const FeedbackTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const form = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });

  const search = form.watch("search");

  const url = `/api/action/feedback?page=${pagination.pageIndex}&limit=${pagination.pageSize}&search=${search}`;
  const { data, isValidating } = useSWR(url);

  const columns: ColumnDef<Feedback>[] = [
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Message",
      accessorKey: "message",
    },
    {
      header: "Submitted At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-semibold">Feedback</h1>
        <form
          className="flex w-full gap-2"
          onSubmit={form.handleSubmit(() => {})}
        >
          <Input
            type="search"
            placeholder="Search by name, email, phone..."
            {...form.register("search")}
            className="w-full max-w-xs"
          />
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Clear
          </Button>
        </form>
      </div>

      <DataTable
        data={data || []}
        columns={columns}
        isPending={isValidating}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </>
  );
};

export default FeedbackTable;
