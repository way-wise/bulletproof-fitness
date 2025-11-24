import prisma from "@/lib/prisma";
import { RewardType } from "@prisma/client";

export interface CreatePointTransactionParams {
  userId: string;
  actionType: RewardType;
  referenceId?: string;
  points: number;
  description: string;
  status?: "pending" | "approved" | "rejected";
  approvedBy?: string;
  notes?: string;
}

export interface PointTransactionFilters {
  userId?: string;
  actionType?: RewardType;
  status?: "pending" | "approved" | "rejected";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class PointTrackingService {
  /**
   * Auto-expire pending transactions older than specified days
   */
  async expirePendingTransactions(daysOld = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - daysOld);

    const expiredTransactions = await prisma.userPointTransaction.findMany({
      where: {
        status: "pending",
        createdAt: {
          lt: expiryDate,
        },
      },
    });

    const expiredIds = [];

    for (const transaction of expiredTransactions) {
      // Remove points from pending
      await prisma.users.update({
        where: { id: transaction.userId },
        data: {
          pendingPoints: {
            decrement: transaction.points,
          },
        },
      });

      // Mark transaction as expired
      await prisma.userPointTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "expired",
          notes: `Auto-expired after ${daysOld} days`,
        },
      });

      expiredIds.push(transaction.id);
    }

    return {
      expired: expiredIds.length,
      transactions: expiredIds,
    };
  }

  /**
   * Create a new point transaction
   */
  async createTransaction(params: CreatePointTransactionParams) {
    const {
      userId,
      actionType,
      referenceId,
      points,
      description,
      status = "pending",
      approvedBy,
      notes,
    } = params;

    // Create the transaction
    const transaction = await prisma.userPointTransaction.create({
      data: {
        userId,
        actionType,
        referenceId,
        points,
        description,
        status,
        approvedBy,
        notes,
        approvedAt: status === "approved" ? new Date() : null,
      },
    });

    // Update user's pending or available points based on status
    if (status === "approved") {
      await prisma.users.update({
        where: { id: userId },
        data: {
          availablePoints: {
            increment: points,
          },
        },
      });
    } else if (status === "pending") {
      await prisma.users.update({
        where: { id: userId },
        data: {
          pendingPoints: {
            increment: points,
          },
        },
      });
    }

    return transaction;
  }

  /**
   * Approve a pending point transaction
   */
  async approveTransaction(
    transactionId: string,
    approvedBy: string,
    notes?: string,
  ) {
    const transaction = await prisma.userPointTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending");
    }

    // Update transaction status
    const updatedTransaction = await prisma.userPointTransaction.update({
      where: { id: transactionId },
      data: {
        status: "approved",
        approvedBy,
        approvedAt: new Date(),
        notes,
      },
    });

    // Move points from pending to available
    await prisma.users.update({
      where: { id: transaction.userId },
      data: {
        pendingPoints: {
          decrement: transaction.points,
        },
        availablePoints: {
          increment: transaction.points,
        },
      },
    });

    return updatedTransaction;
  }

  /**
   * Reject a pending point transaction
   */
  async rejectTransaction(
    transactionId: string,
    approvedBy: string,
    notes?: string,
  ) {
    const transaction = await prisma.userPointTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending");
    }

    // Update transaction status
    const updatedTransaction = await prisma.userPointTransaction.update({
      where: { id: transactionId },
      data: {
        status: "rejected",
        approvedBy,
        notes,
      },
    });

    // Remove points from pending
    await prisma.users.update({
      where: { id: transaction.userId },
      data: {
        pendingPoints: {
          decrement: transaction.points,
        },
      },
    });

    return updatedTransaction;
  }

  /**
   * Get point transactions with filters
   */
  async getTransactions(filters: PointTransactionFilters = {}) {
    const {
      userId,
      actionType,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.userId = userId;
    if (actionType) where.actionType = actionType;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      prisma.userPointTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.userPointTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user's point summary
   */
  async getUserPointSummary(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        availablePoints: true,
        pendingPoints: true,
        totalPoints: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get transaction counts by type and status
    const transactionStats = await prisma.userPointTransaction.groupBy({
      by: ["actionType", "status"],
      where: { userId },
      _count: {
        id: true,
      },
      _sum: {
        points: true,
      },
    });

    return {
      user,
      stats: transactionStats,
      totalEarned: user.availablePoints + user.pendingPoints,
    };
  }

  /**
   * Get pending transactions for admin approval
   */
  async getPendingTransactions(limit = 50) {
    return await prisma.userPointTransaction.findMany({
      where: { status: "pending" },
      take: limit,
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Bulk approve transactions for a specific content (e.g., when content is published)
   * Uses database transaction to handle race conditions
   */
  async approveTransactionsForContent(referenceId: string, approvedBy: string) {
    return await prisma.$transaction(async (tx) => {
      // Find and lock pending transactions for this content
      const transactions = await tx.userPointTransaction.findMany({
        where: {
          referenceId,
          status: "pending",
        },
      });

      const approvedTransactions = [];

      for (const transaction of transactions) {
        // Update transaction status
        const updatedTransaction = await tx.userPointTransaction.update({
          where: { id: transaction.id },
          data: {
            status: "approved",
            approvedBy,
            approvedAt: new Date(),
            notes: `Content published: ${referenceId}`,
          },
        });

        // Update user points
        await tx.users.update({
          where: { id: transaction.userId },
          data: {
            pendingPoints: {
              decrement: transaction.points,
            },
            availablePoints: {
              increment: transaction.points,
            },
          },
        });

        approvedTransactions.push(updatedTransaction);
      }

      return approvedTransactions;
    });
  }

  /**
   * Bulk reject transactions for a specific content (e.g., when content is rejected)
   */
  async rejectTransactionsForContent(
    referenceId: string,
    approvedBy: string,
    reason?: string,
  ) {
    const transactions = await prisma.userPointTransaction.findMany({
      where: {
        referenceId,
        status: "pending",
      },
    });

    const rejectedTransactions = [];

    for (const transaction of transactions) {
      const rejected = await this.rejectTransaction(
        transaction.id,
        approvedBy,
        reason || `Content rejected: ${referenceId}`,
      );
      rejectedTransactions.push(rejected);
    }

    return rejectedTransactions;
  }
}

export const pointTrackingService = new PointTrackingService();
