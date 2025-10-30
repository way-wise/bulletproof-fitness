import prisma from "@/lib/prisma";

/**
 * Dynamic Permission Service
 * 
 * This service provides runtime permission checking based on database-stored roles and permissions.
 * It integrates with Better Auth's role system (stored in users.role field).
 */

/**
 * Check if a user has specific permissions
 * @param userId - The user ID to check
 * @param permissions - Array of permission strings in format "resource:action" (e.g., ["exerciseSetup:create", "exerciseLibrary:publish"])
 * @returns Promise<boolean> - True if user has ALL specified permissions
 * 
 * @example
 * ```ts
 * const canPublish = await hasPermission(userId, ["exerciseSetup:publish"]);
 * const canModerate = await hasPermission(userId, ["exerciseSetup:block", "exerciseLibrary:block"]);
 * ```
 */
export async function hasPermission(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  try {
    // Get user's role
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user?.role) {
      return false;
    }

    // Parse permission strings into resource:action pairs
    const permissionChecks = permissions.map((perm) => {
      const [resource, action] = perm.split(":");
      if (!resource || !action) {
        throw new Error(`Invalid permission format: ${perm}. Use "resource:action" format.`);
      }
      return { resource, action };
    });

    // Check if role has all required permissions
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        role: {
          name: user.role,
        },
        permission: {
          OR: permissionChecks.map(({ resource, action }) => ({
            resource,
            action,
          })),
        },
      },
      include: {
        permission: true,
      },
    });

    // User must have ALL requested permissions
    return rolePermissions.length === permissions.length;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Check if a user has ANY of the specified permissions (OR logic)
 * @param userId - The user ID to check
 * @param permissions - Array of permission strings
 * @returns Promise<boolean> - True if user has ANY of the specified permissions
 */
export async function hasAnyPermission(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user?.role) {
      return false;
    }

    const permissionChecks = permissions.map((perm) => {
      const [resource, action] = perm.split(":");
      return { resource, action };
    });

    const rolePermissions = await prisma.rolePermission.findFirst({
      where: {
        role: {
          name: user.role,
        },
        permission: {
          OR: permissionChecks.map(({ resource, action }) => ({
            resource,
            action,
          })),
        },
      },
    });

    return !!rolePermissions;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Require user to have specific permissions, throw error if not
 * @param userId - The user ID to check
 * @param permissions - Array of permission strings
 * @param errorMessage - Custom error message (optional)
 * @throws Error if user doesn't have required permissions
 */
export async function requirePermission(
  userId: string,
  permissions: string[],
  errorMessage?: string
): Promise<void> {
  const hasPerms = await hasPermission(userId, permissions);

  if (!hasPerms) {
    throw new Error(
      errorMessage || `Missing required permissions: ${permissions.join(", ")}`
    );
  }
}

/**
 * Get all permissions for a role
 * @param id - The user/entity ID
 * @returns Promise<Array<{resource: string, action: string}>> - Array of permissions
 */
export async function getPermissions(id: string) {
  try {
    const entity = await prisma.users.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!entity?.role) {
      return [];
    }

    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        role: {
          name: entity.role,
        },
      },
      include: {
        permission: {
          select: {
            resource: true,
            action: true,
            displayName: true,
            group: true,
          },
        },
      },
    });

    return rolePermissions.map((rp: any) => rp.permission);
  } catch (error) {
    console.error("Error getting permissions:", error);
    return [];
  }
}

/**
 * Get all permissions grouped by resource
 * @param id - The user/entity ID
 * @returns Promise<Record<string, string[]>> - Object with resources as keys and arrays of actions as values
 * 
 * @example
 * ```ts
 * // Returns: { exerciseSetup: ["create", "update", "delete"], user: ["list", "ban"] }
 * const perms = await getPermissionsGrouped(id);
 * ```
 */
export async function getPermissionsGrouped(id: string) {
  const permissions = await getPermissions(id);

  return permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm.action);
    return acc;
  }, {} as Record<string, string[]>);
}

/**
 * Check if a role exists
 * @param roleName - The role name to check
 * @returns Promise<boolean> - True if role exists
 */
export async function roleExists(roleName: string): Promise<boolean> {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });
  return !!role;
}

/**
 * Get role details with all permissions
 * @param roleName - The role name
 * @returns Promise<Role with permissions or null>
 */
export async function getRoleWithPermissions(roleName: string) {
  return await prisma.role.findUnique({
    where: { name: roleName },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

/**
 * Create a new role
 * @param data - Role data
 * @returns Promise<Role> - Created role
 */
export async function createRole(data: {
  name: string;
  description?: string;
  permissionIds: string[];
}) {
  return await prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
      rolePermissions: {
        create: data.permissionIds.map((permissionId: any) => ({
          permissionId,
        })),
      },
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

/**
 * Update role permissions
 * @param roleName - The role name
 * @param permissionIds - Array of permission IDs
 */
export async function updateRolePermissions(
  roleName: string,
  permissionIds: string[]
) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  // Delete existing permissions and create new ones
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    }),
    prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      })),
    }),
  ]);
}

/**
 * Delete a role (only if not a system role)
 * @param roleName - The role name
 */
export async function deleteRole(roleName: string) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  if (role.isSystem) {
    throw new Error(`Cannot delete system role: ${roleName}`);
  }

  await prisma.role.delete({
    where: { name: roleName },
  });
}

/**
 * Get all roles
 */
export async function getAllRoles() {
  return await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Get all permissions
 */
export async function getAllPermissions() {
  return await prisma.permission.findMany({
    orderBy: [{ group: "asc" }, { resource: "asc" }, { action: "asc" }],
  });
}

/**
 * Get all permissions grouped by group (for UI)
 */
export async function getAllPermissionsGrouped() {
  const permissions = await getAllPermissions();

  return permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.group]) {
      acc[perm.group] = [];
    }
    acc[perm.group].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);
}

/**
 * Assign role to entity
 * @param id - The entity ID
 * @param roleName - The role name
 */
export async function assignRole(id: string, roleName: string) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  await prisma.users.update({
    where: { id },
    data: { role: roleName },
  });
}
