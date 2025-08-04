import LibraryVideoUpload from "../../_components/upload-video/LibraryVideoUpload";

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic";

const ExerciseLibrary = () => {
  return (
    <div className="py-12">
      <LibraryVideoUpload />
    </div>
  );
};

export default ExerciseLibrary;
