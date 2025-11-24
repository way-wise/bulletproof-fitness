"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableFilters,
  type FilterValues,
} from "@/app/dashboard/_components/shared/TableFilters";
import { format } from "date-fns";
import type { PaginationState } from "@tanstack/react-table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PointTransaction = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  actionType: string;
  referenceId?: string;
  points: number;
  description: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  notes?: string;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
};

const actionTypeColors = {
  LIKE: "bg-blue-100 text-blue-800",
  DISLIKE: "bg-orange-100 text-orange-800",
  RATING: "bg-purple-100 text-purple-800",
  UPLOAD_EXERCISE: "bg-indigo-100 text-indigo-800",
  UPLOAD_LIBRARY: "bg-indigo-100 text-indigo-800",
  DEMO_CENTER: "bg-teal-100 text-teal-800",
};

export default function PointTransactionsPage() {
  const [filters, setFilters] = useState<FilterValues>({
    userId: "",
    actionType: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const buildUrl = () => {
    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
    });

    if (filters.userId && typeof filters.userId === "string")
      params.append("userId", filters.userId);
    if (
      filters.actionType &&
      typeof filters.actionType === "string" &&
      filters.actionType !== "all"
    )
      params.append("actionType", filters.actionType);
    if (
      filters.status &&
      typeof filters.status === "string" &&
      filters.status !== "all"
    )
      params.append("status", filters.status);
    if (filters.startDate && typeof filters.startDate === "string")
      params.append("startDate", filters.startDate);
    if (filters.endDate && typeof filters.endDate === "string")
      params.append("endDate", filters.endDate);

    return `/api/features/points?${params.toString()}`;
  };

  const url = buildUrl();
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const columns = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: any) => {
        const user = row.getValue("user") as PointTransaction["user"];
        return (
          <div className="text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "actionType",
      header: "Action",
      cell: ({ row }: any) => {
        const actionType = row.getValue("actionType") as string;
        return (
          <Badge
            className={
              actionTypeColors[actionType as keyof typeof actionTypeColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {actionType.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }: any) => {
        const points = row.getValue("points") as number;
        return (
          <div
            className={`font-medium ${points > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {points > 0 ? "+" : ""}
            {points}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div
          className="max-w-xs truncate text-sm"
          title={row.getValue("description")}
        >
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "approvedAt",
      header: "Approved",
      cell: ({ row }: any) => {
        const approvedAt = row.getValue("approvedAt");
        return approvedAt ? (
          <div className="text-sm">
            {format(new Date(approvedAt), "MMM dd, yyyy HH:mm")}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
  ];

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      actionType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setPagination({ pageIndex: 0, pageSize: 20 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Point Transactions</h1>
          <p className="text-gray-600">
            View and manage all point transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => mutate()}>Refresh</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <TableFilters
          config={{
            showSearch: true,
            searchPlaceholder: "Search by User ID...",
            multiSelects: [
              {
                key: "actionType",
                label: "Action Type",
                placeholder: "Filter by action type",
                options: [
                  { value: "LIKE", label: "Like" },
                  { value: "DISLIKE", label: "Dislike" },
                  { value: "RATING", label: "Rating" },
                  { value: "UPLOAD_EXERCISE", label: "Exercise Upload" },
                  { value: "UPLOAD_LIBRARY", label: "Library Upload" },
                  { value: "DEMO_CENTER", label: "Demo Center" },
                ],
              },
              {
                key: "status",
                label: "Status",
                placeholder: "Filter by status",
                options: [
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "expired", label: "Expired" },
                ],
              },
            ],
            sortOptions: [
              { field: "createdAt", label: "Created Date" },
              { field: "actionType", label: "Action Type" },
              { field: "status", label: "Status" },
            ],
          }}
          values={filters}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Transactions</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap text-gray-700">
                  Date Range:
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        startDate: e.target.value,
                      })
                    }
                    placeholder="Start Date"
                    className="w-40"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        endDate: e.target.value,
                      })
                    }
                    placeholder="End Date"
                    className="w-40"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={
                data || {
                  data: [],
                  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
                }
              }
              isPending={isLoading}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
