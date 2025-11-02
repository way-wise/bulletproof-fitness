import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role) {
      return Response.json({ error: "Role is required" }, { status: 400 });
    }

    // Get the target user
    const targetUser = await prisma.users.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // CRITICAL: Prevent changing admin users' roles
    if (targetUser.role === "admin") {
      return Response.json(
        { 
          error: "Cannot change admin role. Admin users are protected for security reasons." 
        },
        { status: 403 }
      );
    }

    // Verify role exists
    const roleExists = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleExists) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update user role
    await prisma.users.update({
      where: { id },
      data: { role },
    });

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
