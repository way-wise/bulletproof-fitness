import Header from "@/app/dashboard/_components/header";
import Sidebar from "@/app/dashboard/_components/sidebar";
import { getSession } from "@/lib/auth";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  // If not authenticated, redirect to sign-in
  if (!session) {
    redirect("/auth/sign-in");
  }

  // If not admin, redirect to profile
  if (session.user?.role !== "admin") {
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
