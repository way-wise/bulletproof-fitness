import { getSession, type auth } from "@/lib/auth";
import FormsButtonPage from "../_components/upload-video/FormButtonPage";
import UploadVideoSection from "../_components/upload-video/UploadVideoSection";

type Session = typeof auth.$Infer.Session;

const page = async () => {
  const session = await getSession();
  if (!session) {
    return <FormsButtonPage />;
  }

  return (
    <div>
      <UploadVideoSection />
    </div>
  );
};

export default page;
