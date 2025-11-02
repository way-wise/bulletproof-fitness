import { getAllPermissionsGrouped } from "@/lib/permissions-service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateRoleForm } from "@/components/admin/CreateRoleForm";

export default async function CreateRolePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "super") {
    redirect("/");
  }

  const permissionGroups = await getAllPermissionsGrouped();

  return (
    <div className="py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Role</h1>
        <p className="text-muted-foreground mt-2">
          Create a new role and assign permissions
        </p>
      </div>

      <CreateRoleForm permissionGroups={permissionGroups} />
    </div>
  );
}
