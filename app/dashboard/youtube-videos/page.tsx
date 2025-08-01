import { YouTubeVideoTable } from "../_components/youtubeVideosComp/exercise-library-video-table";

export default function YouTubeVideosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">YouTube Videos</h1>
        <p className="text-muted-foreground">
          Manage your uploaded YouTube videos, control visibility, and monitor
          performance.
        </p>
      </div>
      <YouTubeVideoTable />
    </div>
  );
}
