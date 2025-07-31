import { DemoCenterDetails } from "./demo-center-details";

interface DemoCenterPageProps {
  params: {
    id: string;
  };
}

const DemoCenterPage = ({ params }: DemoCenterPageProps) => {
  return <DemoCenterDetails id={params.id} />;
};

export default DemoCenterPage;
