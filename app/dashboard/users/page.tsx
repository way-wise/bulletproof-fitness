import { client } from "@/lib/hono-client";
import { UsersTable } from "./table";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; limit: string }>;
}) => {
  const { page, limit } = await searchParams;

  const response = await client.api.users.$get({
    query: {
      page,
      limit,
    },
  });
  const users = await response.json();

  return (
    <>
      <hgroup className="mb-6">
        <h1 className="text-2xl font-medium">Users</h1>
        <p className="text-muted-foreground">
          Manage your users and their roles.
        </p>
      </hgroup>
      <UsersTable data={users} />
    </>
  );
};

export default UsersPage;
