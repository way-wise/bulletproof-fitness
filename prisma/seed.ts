import prisma from "../lib/prisma"

/**
 * Seed script for initializing permissions and roles
 * Run with: npx prisma db seed
 */

async function main() {
  console.log("🌱 Seeding permissions and roles...");

  // Define all 55 permissions with UPPERCASE_WITH_UNDERSCORES format
  const permissions = [
    // Users Management (12 permissions)
    {
      resource: "user",
      action: "list",
      displayName: "USER_LIST",
      description: "View list of users",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "create",
      displayName: "CREATE_USER",
      description: "Create new users",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "update",
      displayName: "UPDATE_USER",
      description: "Update user information",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "view",
      displayName: "VIEW_USER",
      description: "View user details",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "impersonate",
      displayName: "IMPERSONATE_USER",
      description: "Impersonate other users",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "delete",
      displayName: "DELETE_USER",
      description: "Delete users",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "ban",
      displayName: "BAN_UNBAN_USER",
      description: "Ban or unban users",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "set-password",
      displayName: "SET_USER_PASSWORD",
      description: "Set user password",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "set-role",
      displayName: "SET_USER_ROLE",
      description: "Set user role",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "session",
      action: "list",
      displayName: "LIST_SESSION",
      description: "View user sessions",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "session",
      action: "revoke",
      displayName: "REVOKE_SESSION",
      description: "Revoke user sessions",
      group: "USERS_MANAGEMENT",
    },
    {
      resource: "user",
      action: "update",
      displayName: "UPDATE_USER",
      description: "Update user information",
      group: "USERS_MANAGEMENT",
    },

    // Demo Centers (5 permissions)
    {
      resource: "demoCenter",
      action: "list",
      displayName: "DEMO_CENTER_LIST",
      description: "View list of demo centers",
      group: "DEMO_CENTERS",
    },
    {
      resource: "demoCenter",
      action: "create",
      displayName: "CREATE_DEMO_CENTER",
      description: "Create new demo centers",
      group: "DEMO_CENTERS",
    },
    {
      resource: "demoCenter",
      action: "update",
      displayName: "UPDATE_DEMO_CENTER",
      description: "Update demo center information",
      group: "DEMO_CENTERS",
    },
    {
      resource: "demoCenter",
      action: "delete",
      displayName: "DELETE_DEMO_CENTER",
      description: "Delete demo centers",
      group: "DEMO_CENTERS",
    },
    {
      resource: "demoCenter",
      action: "publish",
      displayName: "PUBLISH_UNPUBLISH_DEMO_CENTER",
      description: "Publish or unpublish demo centers",
      group: "DEMO_CENTERS",
    },

    // Role Permissions Management (4 permissions)
    {
      resource: "role",
      action: "list",
      displayName: "ROLE_LIST",
      description: "View list of roles",
      group: "ROLE_PERMISSIONS_MANAGEMENT",
    },
    {
      resource: "role",
      action: "create",
      displayName: "CREATE_ROLE",
      description: "Create new roles",
      group: "ROLE_PERMISSIONS_MANAGEMENT",
    },
    {
      resource: "role",
      action: "update",
      displayName: "UPDATE_ROLE",
      description: "Update role permissions",
      group: "ROLE_PERMISSIONS_MANAGEMENT",
    },
    {
      resource: "role",
      action: "delete",
      displayName: "DELETE_ROLE",
      description: "Delete roles",
      group: "ROLE_PERMISSIONS_MANAGEMENT",
    },

    // Equipment Management (4 permissions)
    {
      resource: "equipment",
      action: "list",
      displayName: "EQUIPMENT_LIST",
      description: "View list of equipment",
      group: "EQUIPMENT_MANAGEMENT",
    },
    {
      resource: "equipment",
      action: "create",
      displayName: "CREATE_EQUIPMENT",
      description: "Create new equipment",
      group: "EQUIPMENT_MANAGEMENT",
    },
    {
      resource: "equipment",
      action: "update",
      displayName: "UPDATE_EQUIPMENT",
      description: "Update equipment",
      group: "EQUIPMENT_MANAGEMENT",
    },
    {
      resource: "equipment",
      action: "delete",
      displayName: "DELETE_EQUIPMENT",
      description: "Delete equipment",
      group: "EQUIPMENT_MANAGEMENT",
    },

    // Body Parts Management (4 permissions)
    {
      resource: "bodyPart",
      action: "list",
      displayName: "BODY_LIST",
      description: "View list of body parts",
      group: "BODY_PARTS_MANAGEMENT",
    },
    {
      resource: "bodyPart",
      action: "create",
      displayName: "CREATE_BODY",
      description: "Create new body parts",
      group: "BODY_PARTS_MANAGEMENT",
    },
    {
      resource: "bodyPart",
      action: "update",
      displayName: "UPDATE_BODY",
      description: "Update body parts",
      group: "BODY_PARTS_MANAGEMENT",
    },
    {
      resource: "bodyPart",
      action: "delete",
      displayName: "DELETE_BODY",
      description: "Delete body parts",
      group: "BODY_PARTS_MANAGEMENT",
    },

    // Racks Management (4 permissions)
    {
      resource: "rack",
      action: "list",
      displayName: "RACK_LIST",
      description: "View list of racks",
      group: "RACKS_MANAGEMENT",
    },
    {
      resource: "rack",
      action: "create",
      displayName: "CREATE_RACK",
      description: "Create new racks",
      group: "RACKS_MANAGEMENT",
    },
    {
      resource: "rack",
      action: "update",
      displayName: "UPDATE_RACK",
      description: "Update racks",
      group: "RACKS_MANAGEMENT",
    },
    {
      resource: "rack",
      action: "delete",
      displayName: "DELETE_RACK",
      description: "Delete racks",
      group: "RACKS_MANAGEMENT",
    },

    // Exercise Library Management (5 permissions)
    {
      resource: "exerciseLibrary",
      action: "list",
      displayName: "EXERCISE_LIBRARY_LIST",
      description: "View list of exercise library",
      group: "EXERCISE_LIBRARY_MANAGEMENT",
    },
    {
      resource: "exerciseLibrary",
      action: "create",
      displayName: "CREATE_EXERCISE_LIBRARY",
      description: "Create new exercise library",
      group: "EXERCISE_LIBRARY_MANAGEMENT",
    },
    {
      resource: "exerciseLibrary",
      action: "update",
      displayName: "UPDATE_EXERCISE_LIBRARY",
      description: "Update exercise library",
      group: "EXERCISE_LIBRARY_MANAGEMENT",
    },
    {
      resource: "exerciseLibrary",
      action: "delete",
      displayName: "DELETE_EXERCISE_LIBRARY",
      description: "Delete exercise library",
      group: "EXERCISE_LIBRARY_MANAGEMENT",
    },
    {
      resource: "exerciseLibrary",
      action: "status",
      displayName: "PUBLIC_PRIVATE_STATUS_UPDATE",
      description: "Update public/private status",
      group: "EXERCISE_LIBRARY_MANAGEMENT",
    },

    // Exercise Setup Management (5 permissions)
    {
      resource: "exerciseSetup",
      action: "list",
      displayName: "EXERCISE_SETUP_LIST",
      description: "View list of exercise setups",
      group: "EXERCISE_SETUP_MANAGEMENT",
    },
    {
      resource: "exerciseSetup",
      action: "create",
      displayName: "CREATE_SETUP_LIBRARY",
      description: "Create new setup library",
      group: "EXERCISE_SETUP_MANAGEMENT",
    },
    {
      resource: "exerciseSetup",
      action: "update",
      displayName: "UPDATE_SETUP_LIBRARY",
      description: "Update setup library",
      group: "EXERCISE_SETUP_MANAGEMENT",
    },
    {
      resource: "exerciseSetup",
      action: "delete",
      displayName: "DELETE_SETUP_LIBRARY",
      description: "Delete setup library",
      group: "EXERCISE_SETUP_MANAGEMENT",
    },
    {
      resource: "exerciseSetup",
      action: "status",
      displayName: "PUBLIC_PRIVATE_STATUS_UPDATE_SETUP",
      description: "Update public/private status for setup",
      group: "EXERCISE_SETUP_MANAGEMENT",
    },

    // Point System Management (3 permissions)
    {
      resource: "points",
      action: "list",
      displayName: "POINTS_LIST",
      description: "View points list",
      group: "POINT_SYSTEM_MANAGEMENT",
    },
    {
      resource: "points",
      action: "update",
      displayName: "UPDATE_POINT",
      description: "Update point values",
      group: "POINT_SYSTEM_MANAGEMENT",
    },
    {
      resource: "points",
      action: "status",
      displayName: "POINT_ACTIVE_DEACTIVATE_STATUS",
      description: "Activate or deactivate points",
      group: "POINT_SYSTEM_MANAGEMENT",
    },

    // Contest Management (6 permissions)
    {
      resource: "contest",
      action: "view",
      displayName: "CONTEST_VIEW",
      description: "View contests",
      group: "CONTEST_MANAGEMENT",
    },
    {
      resource: "contest",
      action: "create",
      displayName: "CREATE_CONTEST",
      description: "Create new contests",
      group: "CONTEST_MANAGEMENT",
    },
    {
      resource: "contest",
      action: "update",
      displayName: "UPDATE_CONTEST",
      description: "Update contest details",
      group: "CONTEST_MANAGEMENT",
    },
    {
      resource: "contest",
      action: "delete",
      displayName: "DELETE_CONTEST",
      description: "Delete contests",
      group: "CONTEST_MANAGEMENT",
    },
    {
      resource: "contest",
      action: "status",
      displayName: "ACTIVE_DEACTIVATE_CONTEST",
      description: "Activate or deactivate contests",
      group: "CONTEST_MANAGEMENT",
    },
    {
      resource: "contest",
      action: "leaderboard",
      displayName: "LEADERBOARD_LIST",
      description: "View contest leaderboard",
      group: "CONTEST_MANAGEMENT",
    },

    // Feedback (1 permission)
    {
      resource: "feedback",
      action: "list",
      displayName: "FEEDBACK_LIST",
      description: "View feedback list",
      group: "FEEDBACK",
    },

    // Demo Center Form Builder (4 permissions)
    {
      resource: "demoCenterForm",
      action: "view",
      displayName: "VIEW_DEMO_CENTER_FORMS",
      description: "View demo center form schemas",
      group: "DEMO_CENTER_MANAGEMENT",
    },
    {
      resource: "demoCenterForm",
      action: "create",
      displayName: "CREATE_DEMO_CENTER_FORMS",
      description: "Create demo center form schemas",
      group: "DEMO_CENTER_MANAGEMENT",
    },
    {
      resource: "demoCenterForm",
      action: "update",
      displayName: "UPDATE_DEMO_CENTER_FORMS",
      description: "Update demo center form schemas",
      group: "DEMO_CENTER_MANAGEMENT",
    },
    {
      resource: "demoCenterForm",
      action: "delete",
      displayName: "DELETE_DEMO_CENTER_FORMS",
      description: "Delete demo center form schemas",
      group: "DEMO_CENTER_MANAGEMENT",
    },

    // System (2 permissions)
    {
      resource: "system",
      action: "dashboard",
      displayName: "DASHBOARD_STATS",
      description: "View dashboard statistics",
      group: "SYSTEM",
    },
    {
      resource: "system",
      action: "activity",
      displayName: "RECENT_ACTIVITY",
      description: "View recent activity",
      group: "SYSTEM",
    },
  ];

  console.log(`📝 Creating ${permissions.length} permissions...`);

  // Upsert all permissions
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: perm.resource,
          action: perm.action,
        },
      },
      update: {
        displayName: perm.displayName,
        description: perm.description,
        group: perm.group,
      },
      create: perm,
    });
  }

  console.log("✅ Permissions created successfully");

  // Create system roles
  console.log("👥 Creating system roles...");

  // Super Admin role with all permissions (for Better Auth admin plugin)
  const superRole = await prisma.role.upsert({
    where: { name: "super" },
    update: {
      description: "Super Administrator with full system access",
      isSystem: true,
    },
    create: {
      name: "super",
      description: "Super Administrator with full system access",
      isSystem: true,
    },
  });

  // Admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {
      description: "Administrator with full access",
      isSystem: true,
    },
    create: {
      name: "admin",
      description: "Administrator with full access",
      isSystem: true,
    },
  });

  // Assign all permissions to both super and admin roles
  const allPermissions = await prisma.permission.findMany();

  // Clear existing permissions for super role
  await prisma.rolePermission.deleteMany({
    where: { roleId: superRole.id },
  });

  // Clear existing permissions for admin role
  await prisma.rolePermission.deleteMany({
    where: { roleId: adminRole.id },
  });

  // Assign all permissions to super role
  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: superRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign all permissions to admin role
  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // User role (basic permissions)
  await prisma.role.upsert({
    where: { name: "user" },
    update: {
      description: "Standard user with basic access",
      isSystem: true,
    },
    create: {
      name: "user",
      description: "Standard user with basic access",
      isSystem: true,
    },
  });

  console.log("✅ Roles created successfully");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
