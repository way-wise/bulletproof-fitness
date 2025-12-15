import prisma from "@/lib/prisma";
import { RewardType } from "@/prisma/generated/client";
import { PaginationQuery } from "@/schema/paginationSchema";
import { Reward } from "@/schema/rewardsSchema";
import { getPaginationQuery } from "../../lib/pagination";

export const rewardService = {
  resetAllUsersPoints: async () => {
    // Mark all approved transactions as rejected to preserve audit trail
    await prisma.userPointTransaction.updateMany({
      where: {
        status: "approved",
      },
      data: {
        status: "rejected",
      },
    });

    // Also reset legacy totalPoints for backward compatibility
    await prisma.users.updateMany({
      data: {
        totalPoints: 0,
      },
    });

    return {
      message: "All users points reset successfully",
    };
  },
  getAllRewards: async (query: PaginationQuery) => {
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
    // //check type already use then error
    const rewardType = await prisma.rewardPoints.findFirst({
      where: {
        type: data.type as RewardType,
      },
    });

    if (rewardType) throw new Error("Reward type already used");

    const reward = await prisma.rewardPoints.create({
      data: {
        name: data.name,
        points: data.points,
        isActive: data.isActive,
        icon: data.icon,
        description: data.description,
        type: data.type,
      },
    });
    return { reward, message: "Reward created successfully" };
  },
  updateReward: async (rewardId: string, data: Reward) => {
    const rewardType = await prisma.rewardPoints.findFirst({
      where: {
        type: data.type as RewardType,
      },
    });

    if (rewardType?.id !== rewardId)
      throw new Error("Reward type does not match");

    const reward = await prisma.rewardPoints.update({
      where: { id: rewardId },
      data: {
        name: data.name,
        points: data.points,
        isActive: data.isActive,
        icon: data.icon,
        description: data.description,
        type: data.type,
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
