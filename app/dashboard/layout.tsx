import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/providers/sidebar-provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
