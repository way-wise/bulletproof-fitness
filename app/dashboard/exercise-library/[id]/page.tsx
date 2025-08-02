import { ExerciseLibraryVideoDetails } from "./exercise-library-details";

interface ExerciseLibraryVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}
const ExerciseLibraryVideoPage = async ({
  params,
}: ExerciseLibraryVideoPageProps) => {
  const { id } = await params;
  return <ExerciseLibraryVideoDetails id={id} />;
};

export default ExerciseLibraryVideoPage;
