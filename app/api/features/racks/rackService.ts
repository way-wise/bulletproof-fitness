import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PaginationQuery } from "@/schema/paginationSchema";
import { rackSchema } from "@/schema/rackSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const racksService = {
  // Get all racks
  getRacks: async (query: PaginationQuery & {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const { skip, take, page, limit } = getPaginationQuery(query);

    // Build where clause
    const where: any = query.search
      ? {
          name: {
            contains: query.search,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Build orderBy
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = (query.sortOrder || "desc") as "asc" | "desc";
    const orderBy: any = { [sortBy]: sortOrder };

    const [racks, total] = await prisma.$transaction([
      prisma.rack.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.rack.count({ where }),
    ]);

    return {
      data: racks,
      meta: {
        page,
        limit,
        total,
      },
    };
  },
  getAllRacks: async () => {
    const racks = await prisma.rack.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return racks;
  },
  // Create rack
  createRack: async (data: InferType<typeof rackSchema>) => {
    const rack = await prisma.rack.create({
      data: {
        name: data.name,
      },
    });

    return rack;
  },

  // Get rack by id
  getRack: async (id: string) => {
    const rack = await prisma.rack.findUnique({
      where: {
        id,
      },
    });

    if (!rack) {
      throw new HTTPException(404, {
        message: "Rack not found",
      });
    }

    return rack;
  },

  // Update rack by id
  updateRack: async (id: string, data: InferType<typeof rackSchema>) => {
    const rack = await prisma.rack.findUnique({
      where: {
        id,
      },
    });

    if (!rack) {
      throw new HTTPException(404, {
        message: "Rack not found",
      });
    }

    const updatedRack = await prisma.rack.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });

    return updatedRack;
  },

  // Delete rack by id
  deleteRack: async (id: string) => {
    const rack = await prisma.rack.delete({
      where: {
        id,
      },
    });

    if (!rack) {
      throw new HTTPException(404, {
        message: "Rack not found",
      });
    }

    return {
      success: true,
      message: "Rack deleted successfully",
    };
  },
};
