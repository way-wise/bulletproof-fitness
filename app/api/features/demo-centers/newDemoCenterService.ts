import prisma from "@/lib/prisma";

export interface NewDemoCenterData {
  type: "business" | "residential";
  details: Record<string, any>;
  userId?: string;
}

export class NewDemoCenterService {
  /**
   * Create a new demo center submission
   */
  async createNewDemoCenter(data: NewDemoCenterData) {
    return await prisma.newDemoCenter.create({
      data: {
        type: data.type,
        details: data.details,
        userId: data.userId,
        status: "pending",
      },
    });
  }

  /**
   * Get a single demo center submission by ID
   */
  async getNewDemoCenterById(id: string) {
    return await prisma.newDemoCenter.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all demo center submissions with optional filters
   */
  async getNewDemoCenters(filters?: {
    type?: "business" | "residential";
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, status, userId, page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      prisma.newDemoCenter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.newDemoCenter.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a demo center submission
   */
  async updateNewDemoCenter(
    id: string,
    data: {
      details?: Record<string, any>;
      status?: string;
    },
  ) {
    return await prisma.newDemoCenter.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a demo center submission
   */
  async deleteNewDemoCenter(id: string) {
    return await prisma.newDemoCenter.delete({
      where: { id },
    });
  }

  /**
   * Update status of a demo center submission
   */
  async updateNewDemoCenterStatus(
    id: string,
    status: "pending" | "approved" | "rejected",
  ) {
    return await prisma.newDemoCenter.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get submissions by user
   */
  async getNewDemoCentersByUser(userId: string) {
    return await prisma.newDemoCenter.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Validate required fields based on form schema
   */
  validateRequiredFields(
    formData: Record<string, any>,
    schema: {
      schema: {
        root: string[];
        entities: Record<string, any>;
      };
      gridChildren: Record<string, any[]>;
    },
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate root level fields
    schema.schema.root.forEach((entityId) => {
      const entity = schema.schema.entities[entityId];
      if (entity && entity.attributes.required) {
        const fieldId = `field_${entityId}`;
        if (!formData[fieldId]) {
          errors.push(`${entity.attributes.label || "Field"} is required`);
        }
      }

      // Validate grid children
      if (entity && entity.type === "gridLayout") {
        const gridChildren = schema.gridChildren[entityId] || [];
        gridChildren.forEach((child: any) => {
          if (child.required) {
            const fieldId = `field_${entityId}_${child.id}`;
            if (!formData[fieldId]) {
              errors.push(`${child.label || "Field"} is required`);
            }
          }
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const newDemoCenterService = new NewDemoCenterService();
