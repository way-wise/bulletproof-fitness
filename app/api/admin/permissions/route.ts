import { getSession } from "@/lib/auth";
import { getAllPermissionsGrouped } from "@/lib/permissions-service";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "super") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const permissionGroups = await getAllPermissionsGrouped();
  return Response.json(permissionGroups);
}
