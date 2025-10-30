"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";

interface Permission {
  id: string;
  resource: string;
  action: string;
  displayName: string;
  group: string;
}

export function CreateRoleForm({
  permissionGroups,
}: {
  permissionGroups: Record<string, Permission[]>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          permissionIds: selectedPermissions,
        }),
      });

      if (res.ok) {
        toast.success("Role created successfully");
        mutate("/api/admin/roles"); // Revalidate roles cache
        router.push("/dashboard/roles");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create role");
      }
    } catch (error) {
      toast.error("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
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
      <div>
        <Link href="/dashboard/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., trainer, editor, viewer"
              required
            />
            <p className="text-sm text-muted-foreground">
              Use lowercase, no spaces (use hyphens or underscores)
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
              placeholder="Describe the role's purpose"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Permissions *</Label>
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
                <div className="ml-6 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-2 rounded p-2 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                        className=""
                      />
                      <Label
                        htmlFor={permission.id}
                        className="cursor-pointer text-sm leading-tight font-normal"
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

        <div className="flex justify-end gap-2">
          <Link href="/dashboard/roles">
            <Button type="button" variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Role
          </Button>
        </div>
      </form>
    </div>
  );
}
