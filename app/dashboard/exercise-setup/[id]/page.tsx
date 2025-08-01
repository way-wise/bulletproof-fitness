import { YouTubeVideoDetails } from "./exercise-setup-details";

interface YouTubeVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

const YouTubeVideoPage = async ({ params }: YouTubeVideoPageProps) => {
  const { id } = await params;
  return <YouTubeVideoDetails id={id} />;
};

export default YouTubeVideoPage;
