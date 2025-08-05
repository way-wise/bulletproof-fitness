import { getSession, type auth } from "@/lib/auth";
import Navbar from "./navbar";
type Session = typeof auth.$Infer.Session;
const MainNavbar = async () => {
  const session = await getSession();
  return (
    <div className="sticky top-0 z-50">
      <Navbar session={session as Session} />
    </div>
  );
};

export default MainNavbar;
