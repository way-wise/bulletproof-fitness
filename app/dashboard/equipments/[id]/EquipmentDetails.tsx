"use client";

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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const EquipmentDetails = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data: user, isLoading } = useSWR(`/api/users/${id}`);

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
          <div className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-start sm:text-left">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile Image"
                width={150}
                height={150}
              />
            ) : (
              <div className="flex size-[150px] items-center justify-center rounded-full bg-muted">
                <UserRound className="size-20 stroke-[1.5] text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="flex items-center justify-center gap-2 text-2xl font-medium sm:justify-start">
                <span>{user.name}</span>
                {user.emailVerified ? (
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
                href={`mailto:${user.email}`}
                className="text-muted-foreground"
              >
                {user.email}
              </Link>
              <p className="text-muted-foreground">
                Since {formatDate(user.createdAt)}
              </p>
              <div className="flex items-center gap-2 py-3">
                <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                  <ShieldUser className="size-6 stroke-[1.5]" />
                  <span className="capitalize">{user.role}</span>
                </div>
                {user.banned ? (
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
    </>
  );
};

// User Details Skeleton
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

export default EquipmentDetails;
