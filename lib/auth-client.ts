import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, superAdmin, admin as adminRole, user } from "./permissions";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  admin,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        super: superAdmin,
        admin: adminRole,
        user,
      },
    }),
  ],
});
