import { getSession } from "@/lib/auth";
import {
  getRoleWithPermissions,
  updateRolePermissions,
  deleteRole,
} from "@/lib/permissions-service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await params;
    const role = await getRoleWithPermissions(name);

    if (!role) {
      return Response.json({ error: "Role not found" }, { status: 404 });
    }

    return Response.json(role);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name } = await params;

  // Prevent editing admin role
  if (name === "admin") {
    return Response.json(
      { error: "Cannot edit admin role" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { permissionIds } = body;

    if (!permissionIds || !Array.isArray(permissionIds)) {
      return Response.json(
        { error: "Invalid permission IDs" },
        { status: 400 }
      );
    }

    await updateRolePermissions(name, permissionIds);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name } = await params;

  // Prevent deleting system roles (admin and user)
  if (name === "admin" || name === "user") {
    return Response.json(
      { error: "Cannot delete system roles" },
      { status: 403 }
    );
  }

  try {
    await deleteRole(name);
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
