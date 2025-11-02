import Header from "@/app/dashboard/_components/header";
import Sidebar from "@/app/dashboard/_components/sidebar";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  // If not authenticated, redirect to sign-in
  if (!session) {
    redirect("/auth/sign-in");
  }

  // Check if user has any permissions
  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user?.role) {
    redirect("/profile");
  }

  const role = await prisma.role.findUnique({
    where: { name: user.role },
    select: {
      rolePermissions: {
        select: {
          permission: {
            select: {
              action: true,
            },
          },
        },
      },
    },
  });

  // Check if user has any LIST or VIEW permission
  const hasListOrViewPermission = role?.rolePermissions.some(
    (rp) => rp.permission.action === "list" || rp.permission.action === "view"
  );

  if (!hasListOrViewPermission) {
    redirect("/profile");
  }

  return (
    <SidebarProvider>
      <div className="fixed flex size-full">
        <Sidebar />
        <div className="flex w-full flex-col overflow-hidden">
          <Header />
          <main className="grow overflow-y-auto bg-zinc-50 p-6 dark:bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
