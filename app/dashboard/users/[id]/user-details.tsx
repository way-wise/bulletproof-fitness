"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date-format";
import {
  ArrowLeft,
  Check,
  CircleX,
  ShieldUser,
  UserRound,
  X,
} from "lucide-react";
import useSWR from "swr";

// UserDetails component
const UserDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useSWR(`/api/users/${id}`);

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
            {data?.image ? (
              <Image
                src={data?.image}
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
                <span>{data?.name}</span>

                {data?.emailVerified ? (
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
                href={`mailto:${data?.email}`}
                className="text-muted-foreground"
              >
                {data?.email}
              </Link>
              <p className="text-muted-foreground">
                Since {data?.createdAt && formatDate(data?.createdAt)}
              </p>
              <div className="flex items-center gap-2 py-3">
                <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                  <ShieldUser className="size-6 stroke-[1.5]" />
                  <span className="capitalize">{data?.role}</span>
                </div>
                {data?.banned ? (
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Rewards Points</h3>
          <span className="text-md text-muted-foreground">
            {data?.totalPoints ?? 0}
          </span>
        </div>
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
