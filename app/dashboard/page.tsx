import DashboardOverview from "./dashboardOverview";

import { getSession, type auth } from "@/lib/auth";
type Session = typeof auth.$Infer.Session;
const DashboardOverviewPage = async () => {
  const session = await getSession();
  return (
    <div>
      <DashboardOverview session={session as Session} />
    </div>
  );
};

export default DashboardOverviewPage;
