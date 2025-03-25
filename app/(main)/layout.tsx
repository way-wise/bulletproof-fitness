import Footer from "@/app/(main)/_components/footer";
import Navbar from "@/app/(main)/_components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
