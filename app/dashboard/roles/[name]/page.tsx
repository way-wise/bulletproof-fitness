import { getRoleWithPermissions, getAllPermissionsGrouped } from "@/lib/permissions-service";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { RoleEditForm } from "@/components/admin/RoleEditForm";

export default async function RoleEditPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  const { name } = await params;
  const role = await getRoleWithPermissions(name);

  if (!role) {
    notFound();
  }

  // Prevent editing admin role
  if (role.name === "admin") {
    redirect("/dashboard/roles");
  }

  const permissionGroups = await getAllPermissionsGrouped();

  return (
    <div className="py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize">Edit Role: {role.name}</h1>
        <p className="text-muted-foreground mt-2">{role.description || "No description"}</p>
      </div>

      <RoleEditForm role={role} permissionGroups={permissionGroups} />
    </div>
  );
}
