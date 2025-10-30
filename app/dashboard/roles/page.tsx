import { getAllRoles } from "@/lib/permissions-service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RolesTable } from "@/components/admin/RolesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RolesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  const roles = await getAllRoles();
  
  // Filter out admin role from the list
  const filteredRoles = roles.filter((role) => role.name !== "admin");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage roles and their permissions
          </p>
        </div>
        <Link href="/dashboard/roles/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </Link>
      </div>

      <RolesTable roles={filteredRoles} />
    </div>
  );
}
