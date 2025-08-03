import ExerciseLIbraryDetails from "../../_components/exerciseSetup/ExerciseLIbraryDetails";

const ExerciseSetupDetailPage = async ({
  params,
}: {
  params: Promise<{ exerciseLibraryId: string }>;
}) => {
  const { exerciseLibraryId } = await params;
  console.log(exerciseLibraryId);
  return (
    <div>
      <ExerciseLIbraryDetails exerciseLibraryId={exerciseLibraryId} />
    </div>
  );
};

export default ExerciseSetupDetailPage;
