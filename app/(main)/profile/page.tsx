import { getSession, type auth } from "@/lib/auth";
import { AuthRequired } from "../_components/user-profile/AuthRequired";
import ProfileSection from "../_components/user-profile/ProfileSection";
type Session = typeof auth.$Infer.Session;
const ProfilePage = async () => {
  const session = await getSession();
  if (!session) {
    return <AuthRequired />;
  }

  return (
    <div>
      <ProfileSection />
    </div>
  );
};

export default ProfilePage;
