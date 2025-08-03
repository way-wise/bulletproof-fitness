import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bodyPartSchema } from "@/schema/bodyparts";
import { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const bodyPartsService = {
  // Get all equipments
  getBodyParts: async (query: PaginationQuery) => {
    const session = await getSession();

    const { skip, take, page, limit } = getPaginationQuery(query);
    const [bodyParts, total] = await prisma.$transaction([
      prisma.bodyPart.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.bodyPart.count(),
    ]);

    return {
      data: bodyParts,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  // Create equipment
  createBodyPart: async (data: InferType<typeof bodyPartSchema>) => {
    const bodyPart = await prisma.bodyPart.create({
      data: {
        name: data.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return bodyPart;
  },

  // Get equipment by id
  getBodyPart: async (id: string) => {
    const bodyPart = await prisma.bodyPart.findUnique({
      where: {
        id,
      },
    });

    if (!bodyPart) {
      throw new HTTPException(404, {
        message: "Body Part not found",
      });
    }

    return bodyPart;
  },
  // Update rack by id
  updateBodyPart: async (
    id: string,
    data: InferType<typeof bodyPartSchema>,
  ) => {
    const bodyPart = await prisma.bodyPart.findUnique({
      where: {
        id,
      },
    });

    if (!bodyPart) {
      throw new HTTPException(404, {
        message: "Body Part not found",
      });
    }

    const updatedBodyPart = await prisma.bodyPart.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
    });

    return updatedBodyPart;
  },

  // Delete equipment by id
  deleteBodyPart: async (id: string) => {
    const bodyPart = await prisma.bodyPart.findUnique({
      where: {
        id,
      },
    });

    if (!bodyPart) {
      throw new HTTPException(404, {
        message: "Body Part not found",
      });
    }

    await prisma.bodyPart.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Body Part deleted successfully",
    };
  },
};
