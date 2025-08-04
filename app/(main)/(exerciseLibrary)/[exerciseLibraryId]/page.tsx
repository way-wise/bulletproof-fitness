import ExLibraryCardDetail from "../../_components/exercide-library/ExLibraryCardDetail";

const CardPage = async ({
  params,
}: {
  params: Promise<{ exerciseLibraryId: string }>;
}) => {
  const { exerciseLibraryId } = await params;

  console.log("Exercise Library ID:", exerciseLibraryId);

  return <ExLibraryCardDetail exerciseLibraryId={exerciseLibraryId} />;
};

export default CardPage;
