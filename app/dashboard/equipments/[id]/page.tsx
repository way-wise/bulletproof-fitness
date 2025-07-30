import EquipmentDetails from "./EquipmentDetails";

const EquipmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <EquipmentDetails id={id} />;
};

export default EquipmentDetailsPage;
