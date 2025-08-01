import ExLibraryCardDetail from "../../_components/exercide-library/ExLibraryCardDetail";

const CardPage = async ({
  params,
}: {
  params: Promise<{ exerciseLibraryId: string }>;
}) => {
  const { exerciseLibraryId } = await params;

  return <ExLibraryCardDetail exerciseLibraryId={exerciseLibraryId} />;
};

export default CardPage;
