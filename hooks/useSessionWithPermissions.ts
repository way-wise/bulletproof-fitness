import { useSession } from "@/lib/auth-client";
import useSWR from "swr";

export function useSessionWithPermissions() {
  const { data: session, isPending } = useSession();
  
  // Fetch permissions separately
  const { data: permissionsData } = useSWR(
    session?.user?.id ? "/api/auth/permissions" : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Merge permissions into session
  if (session?.user && permissionsData?.permissions) {
    return {
      data: {
        ...session,
        user: {
          ...session.user,
          permissions: permissionsData.permissions,
        },
      },
      isPending,
    };
  }

  return { data: session, isPending };
}
