import ExLibraryCardDetail from "../../_components/exercideLibrary/ExLibraryCardDetail";

const CardPage = async ({
  params,
}: {
  params: { exerciseLibraryId: string };
}) => {
  const query = await params;
  const exerciseLibraryId = query?.exerciseLibraryId;

  return <ExLibraryCardDetail exerciseLibraryId={exerciseLibraryId} />;
};

export default CardPage;
