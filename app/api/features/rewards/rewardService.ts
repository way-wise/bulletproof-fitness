import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RewardType } from "@/prisma/generated/enums";
import { PaginationQuery } from "@/schema/paginationSchema";
import { Reward } from "@/schema/rewardsSchema";
import { getPaginationQuery } from "../../lib/pagination";

export const rewardService = {
  getAllRewards: async (query: PaginationQuery) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    const { skip, take, page, limit } = getPaginationQuery(query);
    const [rewards, total] = await prisma.$transaction([
      prisma.rewardPoints.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.rewardPoints.count(),
    ]);

    return {
      data: rewards,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  findById: async (rewardId: string) => {
    const reward = await prisma.rewardPoints.findUniqueOrThrow({
      where: { id: rewardId },
    });
    if (!reward) throw new Error("Reward not found");
    return reward;
  },

  createReward: async (data: Reward) => {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // //check type already use then error
    const rewardType = await prisma.rewardPoints.findFirst({
      where: {
        type: data.type as RewardType,
      },
    });

    console.log(data, "data");
    if (rewardType) throw new Error("Reward type already used");

    const reward = await prisma.rewardPoints.create({
      data: {
        name: data.name,
        points: data.points,
        isActive: data.isActive,
        icon: data.icon,
        description: data.description,
        type: data.type,
        userId: session?.user.id,
      },
    });
    return { reward, message: "Reward created successfully" };
  },

  updateReward: async (rewardId: string, data: Reward) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    // check type already use then error
    const rewardType = await prisma.rewardPoints.findFirst({
      where: {
        type: data.type as RewardType,
      },
    });

    if (rewardType) throw new Error("Reward type already used");
    const reward = await prisma.rewardPoints.update({
      where: { id: rewardId },
      data: {
        name: data.name,
        points: data.points,
        isActive: data.isActive,
        icon: data.icon,
        description: data.description,
        type: data.type,
        userId: session?.user.id,
      },
    });
    return { reward, message: "Reward updated successfully" };
  },

  toggleIsActive: async (
    rewardId: string,
    { isActive }: { isActive: boolean },
  ) => {
    const reward = await prisma.rewardPoints.update({
      where: { id: rewardId },
      data: {
        isActive,
      },
    });
    return { reward, message: "Status updated successfully" };
  },

  deleteReward: async (rewardId: string) => {
    const reward = await prisma.rewardPoints.delete({
      where: { id: rewardId },
    });
    return { reward, message: "Reward deleted successfully" };
  },
};
