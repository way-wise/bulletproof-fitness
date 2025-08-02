interface YouTubeVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

const YouTubeVideoPage = async ({ params }: YouTubeVideoPageProps) => {
  const { id } = await params;
  return <div>Exercise Setup Details</div>;
};

export default YouTubeVideoPage;
