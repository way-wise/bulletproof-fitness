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
          <main className="overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
