"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type UserPointSummary = {
  user: {
    id: string;
    name: string;
    email: string;
    availablePoints: number;
    pendingPoints: number;
    totalPoints: number;
  };
  stats: Array<{
    actionType: string;
    status: string;
    _count: { id: number };
    _sum: { points: number };
  }>;
  totalEarned: number;
};

type PointTransaction = {
  id: string;
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

export default function UserPointHistoryPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [filters, setFilters] = useState({
    actionType: "",
    status: "",
    page: 1,
    limit: 20,
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    params.append("userId", userId);
    return params.toString();
  };

  const {
    data: summary,
    error: summaryError,
    isLoading: summaryLoading,
  } = useSWR(`/api/features/points/summary/${userId}`, fetcher);

  const {
    data: transactions,
    error: transactionsError,
    isLoading: transactionsLoading,
    mutate,
  } = useSWR(
    `/api/features/points/transactions/${userId}?${buildQueryString()}`,
    fetcher,
  );

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
            className={`flex items-center gap-1 font-medium ${points > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {points > 0 ? (
              <TrendingUpIcon className="h-3 w-3" />
            ) : (
              <TrendingDownIcon className="h-3 w-3" />
            )}
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
          <span className="flex items-center gap-1 text-gray-400">
            <ClockIcon className="h-3 w-3" />
            Pending
          </span>
        );
      },
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  if (summaryError || transactionsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/points/transactions">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Transactions
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-600">
              Failed to load user point data. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/points/transactions">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Transactions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">User Point History</h1>
          <p className="text-gray-600">
            {summaryLoading
              ? "Loading..."
              : `Point activity for ${summary?.user?.name}`}
          </p>
        </div>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 rounded bg-gray-200"></div>
                <div className="h-8 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary?.user?.availablePoints || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {summary?.user?.pendingPoints || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary?.totalEarned || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Legacy Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {summary?.user?.totalPoints || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Point Statistics</CardTitle>
          <CardDescription>
            Breakdown of points by action type and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="animate-pulse">
              <div className="mb-2 h-4 rounded bg-gray-200"></div>
              <div className="mb-2 h-4 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary?.stats?.map(
                (
                  stat: {
                    actionType: string;
                    status: string;
                    _count: { id: number };
                    _sum: { points: number };
                  },
                  index: number,
                ) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge
                        className={
                          actionTypeColors[
                            stat.actionType as keyof typeof actionTypeColors
                          ]
                        }
                      >
                        {stat.actionType.replace("_", " ")}
                      </Badge>
                      <Badge
                        className={
                          statusColors[stat.status as keyof typeof statusColors]
                        }
                      >
                        {stat.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat._count.id} transaction
                      {stat._count.id !== 1 ? "s" : ""}
                    </div>
                    <div className="font-medium">
                      {stat._sum.points > 0 ? "+" : ""}
                      {stat._sum.points} points
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select
              value={filters.actionType}
              onValueChange={(value) => handleFilterChange("actionType", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="LIKE">Like</SelectItem>
                <SelectItem value="DISLIKE">Dislike</SelectItem>
                <SelectItem value="RATING">Rating</SelectItem>
                <SelectItem value="UPLOAD_EXERCISE">Exercise Upload</SelectItem>
                <SelectItem value="UPLOAD_LIBRARY">Library Upload</SelectItem>
                <SelectItem value="DEMO_CENTER">Demo Center</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => mutate()}>Refresh</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {transactions?.data
              ? `Showing ${transactions.data.length} recent transactions`
              : "Loading transactions..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={transactions?.data || []}
              isPending={transactionsLoading}
              onPaginationChange={(updaterOrValue) => {
                const newState =
                  typeof updaterOrValue === "function"
                    ? updaterOrValue({
                        pageIndex: filters.page - 1,
                        pageSize: filters.limit,
                      })
                    : updaterOrValue;
                setFilters((prev) => ({
                  ...prev,
                  page: newState.pageIndex + 1,
                }));
              }}
              pagination={{
                pageIndex: filters.page - 1,
                pageSize: filters.limit,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
