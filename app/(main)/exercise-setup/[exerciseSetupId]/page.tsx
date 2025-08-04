import ExerciseSetupDetails from "../../_components/exercise-setup/ExerciseSetupDetails";

const ExerciseSetupDetailPage = async ({
  params,
}: {
  params: Promise<{ exerciseSetupId: string }>;
}) => {
  const { exerciseSetupId } = await params;

  console.log("Exercise Setup ID:", exerciseSetupId);

  return (
    <div>
      <ExerciseSetupDetails exerciseSetupId={exerciseSetupId} />
    </div>
  );
};

export default ExerciseSetupDetailPage;
