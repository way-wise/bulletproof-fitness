import ExerciseSetupVideoForm from "../../_components/upload-video/ExerciseSetupVideoForm";

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic";

const ExerciseLibrary = () => {
  return (
    <div className="py-12">
      <ExerciseSetupVideoForm />
    </div>
  );
};

export default ExerciseLibrary;
