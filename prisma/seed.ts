import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed script for initializing permissions and roles
 * Run automatically with: npx prisma db seed
 */

async function main() {
  console.log("🌱 Seeding permissions and roles...");

  // Define all permissions with groups
  const permissions = [
    // User Management (Better Auth default)
    {
      resource: "user",
      action: "create",
      displayName: "Create User",
      description: "Create new users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "list",
      displayName: "List Users",
      description: "View all users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "set-role",
      displayName: "Set User Role",
      description: "Assign roles to users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "ban",
      displayName: "Ban User",
      description: "Ban/unban users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "impersonate",
      displayName: "Impersonate User",
      description: "Impersonate other users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "delete",
      displayName: "Delete User",
      description: "Permanently delete users",
      group: "user_management",
    },
    {
      resource: "user",
      action: "set-password",
      displayName: "Set User Password",
      description: "Change user passwords",
      group: "user_management",
    },

    // Session Management (Better Auth default)
    {
      resource: "session",
      action: "list",
      displayName: "List Sessions",
      description: "View all user sessions",
      group: "user_management",
    },
    {
      resource: "session",
      action: "revoke",
      displayName: "Revoke Session",
      description: "Revoke user sessions",
      group: "user_management",
    },
    {
      resource: "session",
      action: "delete",
      displayName: "Delete Session",
      description: "Delete user sessions",
      group: "user_management",
    },

    // Exercise Setup Management
    {
      resource: "exerciseSetup",
      action: "create",
      displayName: "Create Exercise Setup",
      description: "Create new exercise setups",
      group: "content_management",
    },
    {
      resource: "exerciseSetup",
      action: "update",
      displayName: "Update Exercise Setup",
      description: "Update exercise setups",
      group: "content_management",
    },
    {
      resource: "exerciseSetup",
      action: "delete",
      displayName: "Delete Exercise Setup",
      description: "Delete exercise setups",
      group: "content_management",
    },
    {
      resource: "exerciseSetup",
      action: "publish",
      displayName: "Publish Exercise Setup",
      description: "Publish exercise setups to public",
      group: "content_management",
    },
    {
      resource: "exerciseSetup",
      action: "block",
      displayName: "Block Exercise Setup",
      description: "Block inappropriate exercise setups",
      group: "content_management",
    },
    {
      resource: "exerciseSetup",
      action: "view-all",
      displayName: "View All Exercise Setups",
      description: "View all exercise setups including private",
      group: "content_management",
    },

    // Exercise Library Management
    {
      resource: "exerciseLibrary",
      action: "create",
      displayName: "Create Library Video",
      description: "Create new library videos",
      group: "content_management",
    },
    {
      resource: "exerciseLibrary",
      action: "update",
      displayName: "Update Library Video",
      description: "Update library videos",
      group: "content_management",
    },
    {
      resource: "exerciseLibrary",
      action: "delete",
      displayName: "Delete Library Video",
      description: "Delete library videos",
      group: "content_management",
    },
    {
      resource: "exerciseLibrary",
      action: "publish",
      displayName: "Publish Library Video",
      description: "Publish videos to library",
      group: "content_management",
    },
    {
      resource: "exerciseLibrary",
      action: "block",
      displayName: "Block Library Video",
      description: "Block inappropriate library videos",
      group: "content_management",
    },
    {
      resource: "exerciseLibrary",
      action: "view-all",
      displayName: "View All Library Videos",
      description: "View all library videos including private",
      group: "content_management",
    },

    // Demo Center Management
    {
      resource: "demoCenter",
      action: "create",
      displayName: "Create Demo Center",
      description: "Create new demo centers",
      group: "platform_management",
    },
    {
      resource: "demoCenter",
      action: "update",
      displayName: "Update Demo Center",
      description: "Update demo center information",
      group: "platform_management",
    },
    {
      resource: "demoCenter",
      action: "delete",
      displayName: "Delete Demo Center",
      description: "Delete demo centers",
      group: "platform_management",
    },
    {
      resource: "demoCenter",
      action: "publish",
      displayName: "Publish Demo Center",
      description: "Publish demo centers",
      group: "platform_management",
    },
    {
      resource: "demoCenter",
      action: "block",
      displayName: "Block Demo Center",
      description: "Block demo centers",
      group: "platform_management",
    },
    {
      resource: "demoCenter",
      action: "view-all",
      displayName: "View All Demo Centers",
      description: "View all demo centers",
      group: "platform_management",
    },

    // Equipment Management
    {
      resource: "equipment",
      action: "create",
      displayName: "Create Equipment",
      description: "Create new equipment",
      group: "platform_management",
    },
    {
      resource: "equipment",
      action: "update",
      displayName: "Update Equipment",
      description: "Update equipment",
      group: "platform_management",
    },
    {
      resource: "equipment",
      action: "delete",
      displayName: "Delete Equipment",
      description: "Delete equipment",
      group: "platform_management",
    },
    {
      resource: "equipment",
      action: "list",
      displayName: "List Equipment",
      description: "View all equipment",
      group: "platform_management",
    },

    // Body Part Management
    {
      resource: "bodyPart",
      action: "create",
      displayName: "Create Body Part",
      description: "Create new body parts",
      group: "platform_management",
    },
    {
      resource: "bodyPart",
      action: "update",
      displayName: "Update Body Part",
      description: "Update body parts",
      group: "platform_management",
    },
    {
      resource: "bodyPart",
      action: "delete",
      displayName: "Delete Body Part",
      description: "Delete body parts",
      group: "platform_management",
    },
    {
      resource: "bodyPart",
      action: "list",
      displayName: "List Body Parts",
      description: "View all body parts",
      group: "platform_management",
    },

    // Rack Management
    {
      resource: "rack",
      action: "create",
      displayName: "Create Rack",
      description: "Create new racks",
      group: "platform_management",
    },
    {
      resource: "rack",
      action: "update",
      displayName: "Update Rack",
      description: "Update racks",
      group: "platform_management",
    },
    {
      resource: "rack",
      action: "delete",
      displayName: "Delete Rack",
      description: "Delete racks",
      group: "platform_management",
    },
    {
      resource: "rack",
      action: "list",
      displayName: "List Racks",
      description: "View all racks",
      group: "platform_management",
    },

    // Contest Management
    {
      resource: "contest",
      action: "create",
      displayName: "Create Contest",
      description: "Create new contests",
      group: "platform_management",
    },
    {
      resource: "contest",
      action: "update",
      displayName: "Update Contest",
      description: "Update contest details",
      group: "platform_management",
    },
    {
      resource: "contest",
      action: "delete",
      displayName: "Delete Contest",
      description: "Delete contests",
      group: "platform_management",
    },
    {
      resource: "contest",
      action: "activate",
      displayName: "Activate Contest",
      description: "Activate/deactivate contests",
      group: "platform_management",
    },
    {
      resource: "contest",
      action: "view-all",
      displayName: "View All Contests",
      description: "View all contests",
      group: "platform_management",
    },

    // Feedback Management
    {
      resource: "feedback",
      action: "view",
      displayName: "View Feedback",
      description: "View user feedback",
      group: "platform_management",
    },
    {
      resource: "feedback",
      action: "delete",
      displayName: "Delete Feedback",
      description: "Delete feedback",
      group: "platform_management",
    },
    {
      resource: "feedback",
      action: "respond",
      displayName: "Respond to Feedback",
      description: "Respond to user feedback",
      group: "platform_management",
    },

    // Reward Points Management
    {
      resource: "rewardPoints",
      action: "create",
      displayName: "Create Reward Config",
      description: "Create reward configurations",
      group: "system_configuration",
    },
    {
      resource: "rewardPoints",
      action: "update",
      displayName: "Update Reward Config",
      description: "Update reward settings",
      group: "system_configuration",
    },
    {
      resource: "rewardPoints",
      action: "delete",
      displayName: "Delete Reward Config",
      description: "Delete reward configs",
      group: "system_configuration",
    },
    {
      resource: "rewardPoints",
      action: "configure",
      displayName: "Configure Rewards",
      description: "Configure reward system",
      group: "system_configuration",
    },

    // Content Stats & Analytics
    {
      resource: "contentStats",
      action: "view",
      displayName: "View Content Stats",
      description: "View content statistics",
      group: "analytics",
    },
    {
      resource: "contentStats",
      action: "export",
      displayName: "Export Analytics",
      description: "Export analytics data",
      group: "analytics",
    },
    {
      resource: "contentStats",
      action: "analyze",
      displayName: "Advanced Analytics",
      description: "Access advanced analytics",
      group: "analytics",
    },
  ];

  // Create all permissions
  console.log("Creating permissions...");
  const createdPermissions = await Promise.all(
    permissions.map((perm) =>
      prisma.permission.upsert({
        where: {
          resource_action: {
            resource: perm.resource,
            action: perm.action,
          },
        },
        update: {},
        create: perm,
      }),
    ),
  );
  console.log(`✅ Created ${createdPermissions.length} permissions`);

  // Get permission IDs for role creation
  const permMap = new Map(
    createdPermissions.map((p) => [`${p.resource}:${p.action}`, p.id]),
  );

  // Define roles with their permissions
  const roles = [
    {
      name: "admin",
      description: "Full system access with all permissions",
      isSystem: true,
      permissions: createdPermissions.map((p) => p.id), // All permissions
    },
    {
      name: "user",
      description: "Standard user with basic content creation permissions",
      isSystem: true,
      permissions: [
        "exerciseSetup:create",
        "exerciseSetup:update",
        "exerciseSetup:delete",
        "exerciseLibrary:create",
        "exerciseLibrary:update",
        "exerciseLibrary:delete",
        "bodyPart:list",
        "equipment:list",
        "rack:list",
      ]
        .map((p) => permMap.get(p)!)
        .filter(Boolean),
    },
  ];

  // Create roles
  console.log("Creating roles...");
  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
      },
      create: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        rolePermissions: {
          create: role.permissions.map((permissionId: any) => ({
            permissionId,
          })),
        },
      },
    });
    console.log(`✅ Created role: ${created.name}`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
