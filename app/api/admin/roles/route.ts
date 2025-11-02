import { getSession } from "@/lib/auth";
import { createRole, getAllRoles } from "@/lib/permissions-service";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "super") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const roles = await getAllRoles();
  return Response.json(roles);
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "super") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, permissionIds } = body;

    if (!name || !permissionIds) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const role = await createRole({
      name,
      description,
      permissionIds,
    });

    return Response.json(role, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
