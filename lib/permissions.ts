import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define all permissions (resources and actions)
const statement = {
  ...defaultStatements, // Includes default admin permissions
  user: ["create", "list", "view", "update", "delete", "ban", "set-role", "set-password", "impersonate"],
  session: ["list", "revoke"],
  role: ["create", "list", "view", "update", "delete"],
  permission: ["list"],
  demoCenter: ["create", "list", "view", "update", "delete", "publish"],
  equipment: ["create", "list", "view", "update", "delete"],
  bodyPart: ["create", "list", "view", "update", "delete"],
  rack: ["create", "list", "view", "update", "delete"],
  exerciseLibrary: ["create", "list", "view", "update", "delete", "status"],
  exerciseSetup: ["create", "list", "view", "update", "delete", "status"],
  points: ["list", "update", "status"],
  contest: ["view", "create", "update", "delete", "status", "leaderboard"],
  feedback: ["list", "view", "update", "delete"],
  system: ["dashboard"],
} as const;

// Create access controller
export const ac = createAccessControl(statement);

// Super admin role - has ALL permissions
export const superAdmin = ac.newRole({
  ...adminAc.statements, // All default admin permissions
  user: ["create", "list", "view", "update", "delete", "ban", "set-role", "set-password", "impersonate"],
  session: ["list", "revoke"],
  role: ["create", "list", "view", "update", "delete"],
  permission: ["list"],
  demoCenter: ["create", "list", "view", "update", "delete", "publish"],
  equipment: ["create", "list", "view", "update", "delete"],
  bodyPart: ["create", "list", "view", "update", "delete"],
  rack: ["create", "list", "view", "update", "delete"],
  exerciseLibrary: ["create", "list", "view", "update", "delete", "status"],
  exerciseSetup: ["create", "list", "view", "update", "delete", "status"],
  points: ["list", "update", "status"],
  contest: ["view", "create", "update", "delete", "status", "leaderboard"],
  feedback: ["list", "view", "update", "delete"],
  system: ["dashboard"],
});

// Admin role - has ALL permissions (same as super, but can be assigned to users)
export const admin = ac.newRole({
  ...adminAc.statements,
  user: ["create", "list", "view", "update", "delete", "ban", "set-role", "set-password", "impersonate"],
  session: ["list", "revoke"],
  role: ["create", "list", "view", "update", "delete"],
  permission: ["list"],
  demoCenter: ["create", "list", "view", "update", "delete", "publish"],
  equipment: ["create", "list", "view", "update", "delete"],
  bodyPart: ["create", "list", "view", "update", "delete"],
  rack: ["create", "list", "view", "update", "delete"],
  exerciseLibrary: ["create", "list", "view", "update", "delete", "status"],
  exerciseSetup: ["create", "list", "view", "update", "delete", "status"],
  points: ["list", "update", "status"],
  contest: ["view", "create", "update", "delete", "status", "leaderboard"],
  feedback: ["list", "view", "update", "delete"],
  system: ["dashboard"],
});

// User role - basic permissions only
export const user = ac.newRole({
  // Users have minimal permissions - they can view their own data
  system: ["dashboard"], // Can access dashboard if they have any permissions
});
