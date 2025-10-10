import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
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
  plugins: [adminClient()],
});
