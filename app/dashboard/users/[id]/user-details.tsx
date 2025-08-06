"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date-format";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  Check,
  CircleX,
  ShieldUser,
  UserRound,
  X,
} from "lucide-react";

// Reward type definition
type TReward = {
  id: string;
  name: string;
  points: number;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// UserDetails component
const UserDetails = ({ id }: { id: string }) => {
  const router = useRouter();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isValidating } = useSWR<{
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      createdAt: string;
      banned: boolean;
      role: string;
      emailVerified: boolean;
      totalPoints: number;
    };
    data: {
      data: TReward[];
      meta: {
        page: number;
        limit: number;
        total: number;
      };
    };
  }>(
    `/api/users/${id}/rewards?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,
  );

  const columns: ColumnDef<TReward>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Points",
      accessorKey: "points",
    },
    {
      header: "Type",
      accessorKey: "type",
    },

    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt || ""),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => formatDate(row.original.updatedAt || ""),
    },
  ];
  console.log(data);
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
          <span>Go Back</span>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {isLoading ? (
          <UserDetailsSkeleton />
        ) : (
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-start sm:text-left">
            {data?.user?.image ? (
              <Image
                src={data?.user?.image}
                alt="Profile Image"
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex size-[150px] items-center justify-center rounded-full bg-muted">
                <UserRound className="size-20 stroke-[1.5] text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="flex items-center justify-center gap-2 text-2xl font-medium sm:justify-start">
                <span>{data?.user?.name}</span>

                {data?.user?.emailVerified ? (
                  <Badge variant="success" size="icon">
                    <Check className="size-4" />
                  </Badge>
                ) : (
                  <Badge variant="destructive" size="icon">
                    <X className="size-4" />
                  </Badge>
                )}
              </h1>
              <Link
                href={`mailto:${data?.user?.email}`}
                className="text-muted-foreground"
              >
                {data?.user?.email}
              </Link>
              <p className="text-muted-foreground">
                Since{" "}
                {data?.user?.createdAt && formatDate(data?.user?.createdAt)}
              </p>
              <div className="flex items-center gap-2 py-3">
                <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                  <ShieldUser className="size-6 stroke-[1.5]" />
                  <span className="capitalize">{data?.user?.role}</span>
                </div>
                {data?.user?.banned ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-destructive/70 py-1.5 pr-2.5 pl-2 text-white">
                    <CircleX className="size-6 stroke-[1.5]" />
                    <span className="capitalize">Banned</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                    <Check className="size-6 stroke-[1.5]" />
                    <span className="capitalize">Not Banned</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-lg border bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="mb-4 text-lg font-semibold">Rewards Points</h3>
          <span className="text-md text-muted-foreground">
            {data?.user?.totalPoints ?? 0}
          </span>
        </div>
        <DataTable
          data={
            data?.data ?? {
              data: [],
              meta: { page: 1, limit: pagination.pageSize, total: 0 },
            }
          }
          columns={columns}
          isPending={isValidating}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </>
  );
};

// Skeleton loader for user profile
const UserDetailsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-start sm:text-left">
      <Skeleton className="size-[150px] rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64 rounded" />
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-6 w-48 rounded" />
      </div>
    </div>
  );
};

export default UserDetails;
