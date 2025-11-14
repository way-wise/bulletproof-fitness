import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { formSchemaService } from "./formSchemaService";
import { HTTPException } from "hono/http-exception";
import prisma from "@/lib/prisma";

const app = new Hono();

// Helper function to check permissions
async function hasPermission(
  userId: string,
  role: string,
  resource: string,
  action: string,
): Promise<boolean> {
  // Super users bypass all permission checks
  if (role === "super") return true;

  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user?.role) return false;

  return user.role.rolePermissions.some(
    (rp) =>
      rp.permission.resource === resource && rp.permission.action === action,
  );
}

// GET /form-schema/:type - Get form schema by type
app.get("/:type", async (c) => {
  const type = c.req.param("type");

  if (type !== "business" && type !== "residential") {
    throw new HTTPException(400, { message: "Invalid form type" });
  }

  try {
    const schema = await formSchemaService.getFormSchema(type);
    return c.json(schema || { type, schema: { fields: [] }, version: 0 });
  } catch (error: any) {
    throw new HTTPException(500, { message: error.message });
  }
});

// POST /form-schema/:type - Create or update form schema
app.post("/:type", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Check permission
  const canUpdate = await hasPermission(
    session.user.id,
    session.user.role as string,
    "demoCenterForm",
    "update",
  );

  if (!canUpdate) {
    throw new HTTPException(403, {
      message: "You don't have permission to update form schemas",
    });
  }

  const type = c.req.param("type");

  if (type !== "business" && type !== "residential") {
    throw new HTTPException(400, { message: "Invalid form type" });
  }

  try {
    const body = await c.req.json();
    const { schema } = body;

    if (!schema || !schema.fields) {
      throw new HTTPException(400, { message: "Invalid schema format" });
    }

    const result = await formSchemaService.upsertFormSchema(type, schema);
    return c.json(result);
  } catch (error: any) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: error.message });
  }
});

// GET /form-schema - Get all form schemas (admin only)
app.get("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Check permission
  const canView = await hasPermission(
    session.user.id,
    session.user.role as string,
    "demoCenterForm",
    "view",
  );

  if (!canView) {
    throw new HTTPException(403, {
      message: "You don't have permission to view form schemas",
    });
  }

  try {
    const schemas = await formSchemaService.getAllFormSchemas();
    return c.json(schemas);
  } catch (error: any) {
    throw new HTTPException(500, { message: error.message });
  }
});

export default app;
