import UserDetails from "./user-details";

const UserDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <UserDetails id={id} />;
};

export default UserDetailsPage;
