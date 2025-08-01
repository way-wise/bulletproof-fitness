import { DemoCenterDetails } from "./demo-center-details";

interface DemoCenterPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DemoCenterPage = async ({ params }: DemoCenterPageProps) => {
  const { id } = await params;
  return <DemoCenterDetails id={id} />;
};

export default DemoCenterPage;
