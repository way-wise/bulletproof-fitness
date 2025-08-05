import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PaginationQuery } from "@/schema/paginationSchema";
import { rackSchema } from "@/schema/rackSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const racksService = {
  // Get all racks
  getRacks: async (query: PaginationQuery) => {
    const { skip, take, page, limit } = getPaginationQuery(query);
    const [racks, total] = await prisma.$transaction([
      prisma.rack.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.rack.count(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        updatedAt: new Date(),
      },
    });

    return updatedRack;
  },

  // Delete rack by id
  deleteRack: async (id: string) => {
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

    await prisma.rack.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Rack deleted successfully",
    };
  },
};
