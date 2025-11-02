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
    role.rolePermissions.map((rp) => rp.permission.id),
  );
  const [formData, setFormData] = useState({
    description: role.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/roles/${role.name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
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

  const togglePermission = (
    permissionId: string,
    permissions: Permission[],
  ) => {
    setSelectedPermissions((prev) => {
      const clickedPermission = permissions.find((p) => p.id === permissionId);
      const isCurrentlySelected = prev.includes(permissionId);

      // Check if the clicked permission is a LIST or VIEW permission
      const isListOrView =
        clickedPermission?.displayName.includes("_LIST") ||
        clickedPermission?.displayName.includes("_VIEW");

      if (isCurrentlySelected) {
        // Deselecting
        if (isListOrView) {
          // If deselecting LIST/VIEW, remove ALL permissions in this group
          const groupPermissionIds = permissions.map((p) => p.id);
          return prev.filter((id) => !groupPermissionIds.includes(id));
        } else {
          // Just remove this permission
          return prev.filter((id) => id !== permissionId);
        }
      } else {
        // Selecting - add this permission AND auto-select LIST/VIEW if exists
        const newSelected = [...prev, permissionId];

        // Find LIST or VIEW permission in the same group
        const listOrViewPerm = permissions.find(
          (p) =>
            (p.displayName.includes("_LIST") ||
              p.displayName.includes("_VIEW")) &&
            !newSelected.includes(p.id),
        );

        if (listOrViewPerm) {
          newSelected.push(listOrViewPerm.id);
        }

        return newSelected;
      }
    });
  };

  const toggleGroup = (permissions: Permission[]) => {
    const permissionIds = permissions.map((p) => p.id);
    const allSelected = permissionIds.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !permissionIds.includes(id)),
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </Link>

        {!role.isSystem && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Role
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the role "{role.name}". This
                  action cannot be undone.
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
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input value={role.name} disabled className="capitalize" />
            <p className="text-xs text-muted-foreground">
              Role name cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={role.isSystem}
              rows={3}
              placeholder="Describe the role's purpose"
            />
          </div>

          {role.isSystem && (
            <p className="rounded-md bg-orange-50 p-3 text-sm text-orange-600">
              ⚠️ This is a system role. You can only modify its permissions.
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Permissions</Label>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedPermissions.length} permissions
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Checkbox
                    id={`group-${group}`}
                    checked={permissions.every((p) =>
                      selectedPermissions.includes(p.id),
                    )}
                    onCheckedChange={() => toggleGroup(permissions)}
                  />
                  <Label
                    htmlFor={`group-${group}`}
                    className="cursor-pointer text-base font-semibold uppercase"
                  >
                    {group.replace(/_/g, " ")}
                  </Label>
                </div>
                <div className="ml-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-2 rounded p-2 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          togglePermission(permission.id, permissions)
                        }
                      />
                      <Label
                        htmlFor={permission.id}
                        className="cursor-pointer text-sm leading-tight font-normal"
                      >
                        {permission.displayName.split("_").join(" ")}
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
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
