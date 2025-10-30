"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { mutate } from "swr";

interface Permission {
  id: string;
  resource: string;
  action: string;
  displayName: string;
  group: string;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  rolePermissions: Array<{
    permission: Permission;
  }>;
}

export function RoleEditForm({
  role,
  permissionGroups,
}: {
  role: Role;
  permissionGroups: Record<string, Permission[]>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.rolePermissions.map((rp) => rp.permission.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/roles/${role.name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissionIds: selectedPermissions,
        }),
      });

      if (res.ok) {
        toast.success("Role updated successfully");
        mutate("/api/admin/roles"); // Revalidate roles cache
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/roles/${role.name}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Role deleted successfully");
        mutate("/api/admin/roles"); // Revalidate roles cache
        router.push("/dashboard/roles");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete role");
      }
    } catch (error) {
      toast.error("Failed to delete role");
    } finally {
      setDeleting(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleGroup = (permissions: Permission[]) => {
    const permissionIds = permissions.map((p) => p.id);
    const allSelected = permissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !permissionIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...permissionIds]),
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
        </Link>

        {!role.isSystem && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Role
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the role "{role.name}".
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input value={role.name} disabled className="capitalize" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={role.description || ""} disabled rows={3} />
          </div>

          {role.isSystem && (
            <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
              ⚠️ This is a system role. You can only modify its permissions.
            </p>
          )}
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Permissions</Label>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedPermissions.length} permissions
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Checkbox
                    id={`group-${group}`}
                    checked={permissions.every((p) =>
                      selectedPermissions.includes(p.id)
                    )}
                    onCheckedChange={() => toggleGroup(permissions)}
                  />
                  <Label
                    htmlFor={`group-${group}`}
                    className="font-semibold text-base uppercase cursor-pointer"
                  >
                    {group.replace(/_/g, " ")}
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-2 p-2 rounded hover:bg-muted/50"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        {permission.displayName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
