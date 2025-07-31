import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { demoCenterSchema } from "@/schema/demoCenters";
import { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const demoCentersService = {
  // Get all demo centers
  getDemoCenters: async (query: PaginationQuery) => {
    const session = await getSession();
    console.log(session);
    const { skip, take, page, limit } = getPaginationQuery(query);
    const [demoCenters, total] = await prisma.$transaction([
      prisma.demoCenter.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
        include: {
          demoCenterEquipments: {
            include: {
              equipment: true,
            },
          },
        },
      }),
      prisma.demoCenter.count(),
    ]);

    return {
      data: demoCenters,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  // Create demo center
  createDemoCenter: async (data: InferType<typeof demoCenterSchema>) => {
    console.log(data);

    // Find the equipment by name to get its ID
    const equipment = await prisma.equipment.findFirst({
      where: {
        name: data.equipment,
      },
    });

    if (!equipment) {
      throw new HTTPException(400, {
        message: `Equipment "${data.equipment}" not found`,
      });
    }

    const demoCenter = await prisma.demoCenter.create({
      data: {
        buildingType: data.buildingType,
        name: data.name,
        address: data.address,
        contact: data.contact,
        cityZip: data.cityZip,
        bio: data.bio,
        image: data.image,
        availability: data.availability,
        // Business specific fields
        weekdays:
          data.weekdays?.filter((day): day is string => Boolean(day)) || [],
        weekends:
          data.weekends?.filter((day): day is string => Boolean(day)) || [],
        weekdayOpen: data.weekdayOpen,
        weekdayClose: data.weekdayClose,
        weekendOpen: data.weekendOpen,
        weekendClose: data.weekendClose,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Create the equipment relationship
        demoCenterEquipments: {
          create: {
            equipmentId: equipment.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
    console.log(demoCenter);

    return demoCenter;
  },

  // Get demo center by id
  getDemoCenter: async (id: string) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: {
        id,
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

    return demoCenter;
  },

  // Delete demo center by id
  deleteDemoCenter: async (id: string) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: {
        id,
      },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

    await prisma.demoCenter.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Demo center deleted successfully",
    };
  },
};
