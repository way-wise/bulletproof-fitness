import prisma from "@/lib/prisma";
import {
  blockDemoCenterSchema,
  DemoCenterQuery,
  demoCenterSchema,
  unblockDemoCenterSchema,
} from "@/schema/demoCenters";
import { PaginationQuery } from "@/schema/paginationSchema";
import { geoDistance } from "@api/lib/geoDistance";
import { getGeoCodeAddress } from "@api/lib/getGeoCodeAddress";
import { getPaginationQuery } from "@api/lib/pagination";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";

export const demoCentersService = {
  getDemoCenters: async (query: DemoCenterQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);
    const { location, range, buildingType, equipments } = query;
    const equipmentsIds = equipments?.split(",");

    let filteredDemoCenters = [];
    let total = 0;

    // Building type filter
    const whereFilter: any = {
      isPublic: true,
      blocked: false,
    };
    if (buildingType) {
      whereFilter.buildingType = buildingType;
    }

    // Equipment filter
    if (equipments && equipmentsIds?.length) {
      whereFilter.demoCenterEquipments = {
        some: {
          equipmentId: {
            in: equipmentsIds,
          },
        },
      };
    }

    // Include the related equipment data in all queries
    const includeClause = {
      demoCenterEquipments: {
        include: {
          equipment: true,
        },
      },
    };

    if (location && range) {
      const userLocation = await getGeoCodeAddress(location);

      if (!userLocation) {
        return {
          data: [],
          meta: { page, limit, total: 0, searchLocation: null, range: null },
        };
      }

      // Get all matching demo centers
      const allMatchingDemoCenters = await prisma.demoCenter.findMany({
        where: whereFilter,
        include: includeClause,
        orderBy: {
          id: "desc",
        },
      });

      const nearbyDemoCenters = allMatchingDemoCenters.filter((center) => {
        if (center.lat && center.lng) {
          const distance = geoDistance(
            userLocation.lat,
            userLocation.lng,
            center.lat,
            center.lng,
          );
          return distance <= range;
        }

        return false;
      });

      filteredDemoCenters = nearbyDemoCenters.slice(skip, skip + take);
      total = nearbyDemoCenters.length;

      // Returning the user's geocoded location and range in the metadata
      return {
        data: filteredDemoCenters,
        meta: {
          page,
          limit,
          total,
          searchLocation: userLocation,
          range,
        },
      };
    } else {
      const [demoCenters, count] = await prisma.$transaction([
        prisma.demoCenter.findMany({
          where: whereFilter,
          include: includeClause,
          skip,
          take,
          orderBy: { id: "desc" },
        }),
        prisma.demoCenter.count({ where: whereFilter }),
      ]);
      filteredDemoCenters = demoCenters;
      total = count;
    }

    return {
      data: filteredDemoCenters,
      meta: {
        page,
        limit,
        total,
        searchLocation: null,
        range: null,
      },
    };
  },
  getDemoCentersDashboard: async (
    query: PaginationQuery & { search?: string },
  ) => {
    const { skip, take, page, limit } = getPaginationQuery(query);

    // Build search filter
    const searchFilter = {
      ...(query.search
        ? {
            OR: [
              {
                name: { contains: query.search, mode: "insensitive" as const },
              },
              {
                buildingType: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                contact: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                address: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                cityZip: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [demoCenters, total] = await prisma.$transaction([
      prisma.demoCenter.findMany({
        where: searchFilter,
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
      prisma.demoCenter.count({
        where: searchFilter,
      }),
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
        // New fields
        isPublic: data.isPublic || false,
        blocked: data.blocked || false,
        blockReason: data.blockReason,
        // Create the equipment relationship
        demoCenterEquipments: {
          createMany: {
            data: data.equipment.map((equipmentId) => ({
              equipmentId,
            })),
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

  // Update demo center status
  updateDemoCenterStatus: async (
    id: string,
    data: { isPublic?: boolean; blocked?: boolean; blockReason?: string },
  ) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: { id },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

    const updatedDemoCenter = await prisma.demoCenter.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return updatedDemoCenter;
  },

  // Update demo center
  updateDemoCenter: async (
    id: string,
    data: InferType<typeof demoCenterSchema>,
  ) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: { id },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

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

    // Update demo center
    const updatedDemoCenter = await prisma.demoCenter.update({
      where: { id },
      data: {
        buildingType: data.buildingType,
        name: data.name,
        address: data.address,
        contact: data.contact,
        cityZip: data.cityZip,
        bio: data.bio,
        image: data.image,
        availability: data.availability,
        weekdays:
          data.weekdays?.filter((day): day is string => Boolean(day)) || [],
        weekends:
          data.weekends?.filter((day): day is string => Boolean(day)) || [],
        weekdayOpen: data.weekdayOpen,
        weekdayClose: data.weekdayClose,
        weekendOpen: data.weekendOpen,
        weekendClose: data.weekendClose,
        isPublic: data.isPublic || false,
        blocked: data.blocked || false,
        blockReason: data.blockReason,
        updatedAt: new Date(),
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    // Update equipment relationship
    await prisma.demoCenterEquipment.deleteMany({
      where: { demoCenterId: id },
    });

    await prisma.demoCenterEquipment.create({
      data: {
        demoCenterId: id,
        equipmentId: equipment.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return updatedDemoCenter;
  },

  // Block demo center
  blockDemoCenter: async (data: InferType<typeof blockDemoCenterSchema>) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: { id: data.demoCenterId },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

    const updatedDemoCenter = await prisma.demoCenter.update({
      where: { id: data.demoCenterId },
      data: {
        blocked: true,
        blockReason: data.blockReason,
        updatedAt: new Date(),
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return updatedDemoCenter;
  },

  // Unblock demo center
  unblockDemoCenter: async (
    data: InferType<typeof unblockDemoCenterSchema>,
  ) => {
    const demoCenter = await prisma.demoCenter.findUnique({
      where: { id: data.demoCenterId },
    });

    if (!demoCenter) {
      throw new HTTPException(404, {
        message: "Demo center not found",
      });
    }

    const updatedDemoCenter = await prisma.demoCenter.update({
      where: { id: data.demoCenterId },
      data: {
        blocked: false,
        blockReason: null,
        updatedAt: new Date(),
      },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return updatedDemoCenter;
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
