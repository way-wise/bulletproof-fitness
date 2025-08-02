import { ExerciseSetupVideoTable } from "../_components/exerciseSetupComp/Exercise-setup-video-table";

export default function ExerciseSetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Exercise Setup Videos
        </h1>
        <p className="text-muted-foreground">
          Manage your exercise setup videos, control visibility, and monitor
          performance.
        </p>
      </div>
      <ExerciseSetupVideoTable />
    </div>
  );
}
