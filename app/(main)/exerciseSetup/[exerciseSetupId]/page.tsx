import ExerciseSetupDetails from "../../_components/exerciseSetup/ExerciseSetupDetails";

const ExerciseSetupDetailPage = async ({
  params,
}: {
  params: Promise<{ exerciseSetupId: string }>;
}) => {
  const { exerciseSetupId } = await params;

  return (
    <div>
      <ExerciseSetupDetails exerciseSetupId={exerciseSetupId} />
    </div>
  );
};

export default ExerciseSetupDetailPage;
