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
import { awardPointsToUser } from "../actions/actionService";
import { RewardType } from "@/prisma/generated/client";

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
    query: PaginationQuery & {
      search?: string;
      buildingType?: string;
      equipmentIds?: string;
      isPublic?: string;
      blocked?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ) => {
    const { skip, take, page, limit } = getPaginationQuery(query);

    // Build where clause with filters
    const where: any = {};
    const andConditions: any[] = [];

    // Search filter
    if (query.search) {
      andConditions.push({
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
      });
    }

    // Building type filter
    if (query.buildingType) {
      andConditions.push({
        buildingType: query.buildingType,
      });
    }

    // Equipment filter
    if (query.equipmentIds) {
      const equipmentIdsArray = query.equipmentIds.split(",").filter(Boolean);
      if (equipmentIdsArray.length > 0) {
        andConditions.push({
          demoCenterEquipments: {
            some: {
              equipmentId: { in: equipmentIdsArray },
            },
          },
        });
      }
    }

    // isPublic filter
    if (query.isPublic !== undefined && query.isPublic !== "") {
      andConditions.push({
        isPublic: query.isPublic === "true",
      });
    }

    // blocked filter
    if (query.blocked !== undefined && query.blocked !== "") {
      andConditions.push({
        blocked: query.blocked === "true",
      });
    }

    // Apply all conditions
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Build orderBy based on sortBy and sortOrder
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = (query.sortOrder || "desc") as "asc" | "desc";
    const orderBy: any = { [sortBy]: sortOrder };

    const [demoCenters, total] = await prisma.$transaction([
      prisma.demoCenter.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          demoCenterEquipments: {
            include: {
              equipment: true,
            },
          },
        },
      }),
      prisma.demoCenter.count({
        where,
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
  createDemoCenter: async (
    data: InferType<typeof demoCenterSchema>,
    userId?: string,
  ) => {
    // Geocode the address to get lat/lng coordinates
    // If address is provided, include it; otherwise just use cityZip
    const fullAddress = data.address
      ? `${data.address}, ${data.cityZip}`
      : data.cityZip;
    const geocodedLocation = await getGeoCodeAddress(fullAddress);

    // Validate that geocoding was successful
    if (!geocodedLocation || !geocodedLocation.lat || !geocodedLocation.lng) {
      throw new HTTPException(400, {
        message: `Invalid address: Unable to geocode the provided address. Please verify the address and try again.`,
      });
    }

    const demoCenter = await prisma.demoCenter.create({
      data: {
        buildingType: data.buildingType,
        name: data.name,
        address: data.address,
        contact: data.contact,
        cityZip: data.cityZip,
        lat: geocodedLocation?.lat || null,
        lng: geocodedLocation?.lng || null,
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

    // Award points to user if userId is provided
    if (userId) {
      await awardPointsToUser(
        userId,
        RewardType.DEMO_CENTER,
        "Demo Center",
        "Demo Center creation reward",
      );
    }

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

    // Find the equipment by ID to get its details
    const equipment = await prisma.equipment.findMany({
      where: {
        id: {
          in: data.equipment.filter(
            (id): id is string => typeof id === "string",
          ),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (data.equipment.length > 0 && equipment.length === 0) {
      throw new HTTPException(400, {
        message: `Equipment not found for the provided IDs`,
      });
    }

    // Check if address has changed and geocode if necessary
    let lat = demoCenter.lat;
    let lng = demoCenter.lng;

    if (
      data.address !== demoCenter.address ||
      data.cityZip !== demoCenter.cityZip
    ) {
      // If address is provided, include it; otherwise just use cityZip
      const fullAddress = data.address
        ? `${data.address}, ${data.cityZip}`
        : data.cityZip;
      const geocodedLocation = await getGeoCodeAddress(fullAddress);

      // Validate that geocoding was successful for the new address
      if (!geocodedLocation || !geocodedLocation.lat || !geocodedLocation.lng) {
        throw new HTTPException(400, {
          message: `Invalid address: Unable to geocode the provided address. Please verify the address and try again.`,
        });
      }

      lat = geocodedLocation.lat;
      lng = geocodedLocation.lng;
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
        lat,
        lng,
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

    // Create new equipment relationships if equipment is provided
    if (equipment.length > 0) {
      await prisma.demoCenterEquipment.createMany({
        data: equipment.map((eq) => ({
          demoCenterId: id,
          equipmentId: eq.id,
        })),
      });
    }

    // Fetch the updated demo center with equipment relationships
    const finalDemoCenter = await prisma.demoCenter.findUnique({
      where: { id },
      include: {
        demoCenterEquipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return finalDemoCenter || updatedDemoCenter;
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
