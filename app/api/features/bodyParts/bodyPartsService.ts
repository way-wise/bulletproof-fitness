
import prisma from "@/lib/prisma";
import { bodyPartSchema } from "@/schema/bodyparts";
import { PaginationQuery } from "@/schema/paginationSchema";
import { HTTPException } from "hono/http-exception";
import { InferType } from "yup";
import { getPaginationQuery } from "../../lib/pagination";

export const bodyPartsService = {
  // Get all body parts
  getBodyParts: async (query: PaginationQuery) => {
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
  getAllBodyParts: async () => {
    const bodyParts = await prisma.bodyPart.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return bodyParts;
  },
  // Create body part
  createBodyPart: async (data: InferType<typeof bodyPartSchema>) => {
    const bodyPart = await prisma.bodyPart.create({
      data: {
        name: data.name,
      },
    });

    return bodyPart;
  },

  // Get body part by id
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
  // Update body part by id
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
      },
    });

    return updatedBodyPart;
  },

  // Delete body part by id
  deleteBodyPart: async (id: string) => {
    const bodyPart = await prisma.bodyPart.delete({
      where: {
        id,
      },
    });

    if (!bodyPart) {
      throw new HTTPException(404, {
        message: "Body Part not found",
      });
    }

    return {
      success: true,
      message: "Body Part deleted successfully",
    };
  },
};
