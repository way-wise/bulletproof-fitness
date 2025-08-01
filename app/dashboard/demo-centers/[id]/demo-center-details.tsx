"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCenter } from "@/lib/dataTypes";
import { formatDate } from "@/lib/date-format";
import { ArrowLeft, Clock, Globe, Lock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DemoCenterDetailsProps {
  id: string;
}

export const DemoCenterDetails = ({ id }: DemoCenterDetailsProps) => {
  const [demoCenter, setDemoCenter] = useState<DemoCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDemoCenter = async () => {
      try {
        const response = await fetch(`/api/demo-centers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch demo center");
        }
        const data = await response.json();
        setDemoCenter(data);
      } catch {
        toast.error("Failed to load demo center details");
        router.push("/dashboard/demo-centers");
      } finally {
        setLoading(false);
      }
    };

    fetchDemoCenter();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!demoCenter) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Demo center not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/demo-centers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{demoCenter.name}</h1>
            <p className="text-muted-foreground">Demo Center Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {demoCenter.isPublic ? (
            <Badge variant="success" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
          {demoCenter.blocked ? (
            <Badge variant="destructive">Blocked</Badge>
          ) : (
            <Badge variant="secondary">Active</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Building Type
              </label>
              <p className="text-lg">{demoCenter.buildingType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-lg">{demoCenter.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <p className="text-sm">{demoCenter.bio}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Availability
              </label>
              <p className="text-sm">{demoCenter.availability}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="text-sm">{demoCenter.address}</p>
                <p className="text-sm">{demoCenter.cityZip}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Contact
                </label>
                <p className="text-sm">{demoCenter.contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Weekdays
              </label>
              <p className="text-sm">
                {demoCenter.weekdayOpen} - {demoCenter.weekdayClose}
              </p>
              <p className="text-xs text-muted-foreground">
                {demoCenter.weekdays.join(", ")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Weekends
              </label>
              <p className="text-sm">
                {demoCenter.weekendOpen} - {demoCenter.weekendClose}
              </p>
              <p className="text-xs text-muted-foreground">
                {demoCenter.weekends.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Public Status
              </label>
              <div className="mt-1">
                {demoCenter.isPublic ? (
                  <Badge
                    variant="success"
                    className="flex w-fit items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex w-fit items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Private
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Blocked Status
              </label>
              <div className="mt-1">
                {demoCenter.blocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
            </div>
            {demoCenter.blockReason && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Block Reason
                </label>
                <p className="text-sm text-destructive">
                  {demoCenter.blockReason}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="text-sm">{formatDate(demoCenter.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Updated At
              </label>
              <p className="text-sm">{formatDate(demoCenter.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
