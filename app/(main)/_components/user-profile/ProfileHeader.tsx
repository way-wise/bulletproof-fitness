"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import { Calendar, Edit, Mail, Trophy } from "lucide-react";
import Image from "next/image";

export const ProfileHeader = ({
  user,
  isLoading,
  onEditClick,
}: {
  user: UserProfile;
  isLoading: boolean;
  onEditClick: () => void;
}) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative">
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            ) : (
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            {/* <div className="absolute -right-2 -bottom-2">
              {user?.emailVerified ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Unverified
                </Badge>
              )}
            </div> */}
          </div>

          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              {user?.role && <Badge variant="secondary">{user.role}</Badge>}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Member since{" "}
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">
                {user?.totalPoints || 0} Points
              </span>
            </div>
          </div>

          <Button onClick={onEditClick} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
