import ExerciseSetupDetails from "../../_components/exercise-setup/ExerciseSetupDetails";

const ExerciseSetupDetailPage = async ({
  params,
}: {
  params: Promise<{ exerciseSetupId: string }>;
}) => {
  const { exerciseSetupId } = await params;

  return <ExerciseSetupDetails exerciseSetupId={exerciseSetupId} />;
};

export default ExerciseSetupDetailPage;
