import { ExerciseSetupDetails } from "./exercise-setup-details";

interface YouTubeVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

const YouTubeVideoPage = async ({ params }: YouTubeVideoPageProps) => {
  const { id } = await params;
  return <ExerciseSetupDetails id={id} />;
};

export default YouTubeVideoPage;
