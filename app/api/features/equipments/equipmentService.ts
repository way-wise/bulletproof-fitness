import prisma from "@/lib/prisma";
import { equipmentSchema } from "@/schema/equipment";
import { PaginationQuery } from "@/schema/paginationSchema";
import { getPaginationQuery } from "@api/lib/pagination";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";

export const equipmentService = {
  // Get all equipments
  getAllEquipments: async () => {
    const equipments = await prisma.equipment.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return equipments;
  },
  // Get all equipments (Paginated)
  getEquipments: async (query: PaginationQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);
    const [equipments, total] = await prisma.$transaction([
      prisma.equipment.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.equipment.count(),
    ]);

    return {
      data: equipments,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  // Create equipment
  createEquipment: async (data: InferType<typeof equipmentSchema>) => {
    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return equipment;
  },

  // Get equipment by id
  getEquipment: async (id: string) => {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id,
      },
    });

    if (!equipment) {
      throw new HTTPException(404, {
        message: "Equipment not found",
      });
    }

    return equipment;
  },

  // Delete equipment by id
  deleteEquipment: async (id: string) => {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id,
      },
    });

    if (!equipment) {
      throw new HTTPException(404, {
        message: "Equipment not found",
      });
    }

    await prisma.equipment.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Equipment deleted successfully",
    };
  },
  // Update equipment by id
  updateEquipment: async (
    id: string,
    data: InferType<typeof equipmentSchema>,
  ) => {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id,
      },
    });

    if (!equipment) {
      throw new HTTPException(404, {
        message: "Equipment not found",
      });
    }

    const updatedEquipment = await prisma.equipment.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
    });

    return updatedEquipment;
  },
};
