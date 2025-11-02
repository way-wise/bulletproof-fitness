import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ permissions: [] });
  }

  // Fetch user's role name
  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
    },
  });

  if (!user?.role) {
    return NextResponse.json({ permissions: [] });
  }

  // Fetch role with permissions
  const roleWithPermissions = await prisma.role.findUnique({
    where: { name: user.role },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  const permissions = roleWithPermissions?.rolePermissions.map((rp: any) => ({
    resource: rp.permission.resource,
    action: rp.permission.action,
    displayName: rp.permission.displayName,
  })) || [];

  return NextResponse.json({ permissions });
}
