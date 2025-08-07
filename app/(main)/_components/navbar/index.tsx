import { getSession, type auth } from "@/lib/auth";
import Navbar from "./navbar";
type Session = typeof auth.$Infer.Session;
const MainNavbar = async () => {
  const session = await getSession();
  return <Navbar session={session as Session} />;
};

export default MainNavbar;
