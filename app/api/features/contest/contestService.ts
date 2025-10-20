import prisma from "@/lib/prisma";
import { ContestFormData, UpdateContestFormData } from "@/schema/contestSchema";

export class ContestService {
  // Get all contests (admin)
  static async getAllContests() {
    try {
      const contests = await prisma.contest.findMany({
        include: {
          sections: {
            include: {
              cards: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        data: contests,
      };
    } catch (error) {
      console.error("Error fetching contests:", error);
      return {
        success: false,
        message: "Failed to fetch contests",
      };
    }
  }

  // Get active contest (public)
  static async getActiveContest() {
    try {
      const contest = await prisma.contest.findFirst({
        where: { isActive: true },
        include: {
          sections: {
            where: { isVisible: true },
            include: {
              cards: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        data: contest,
      };
    } catch (error) {
      console.error("Error fetching active contest:", error);
      return {
        success: false,
        message: "Failed to fetch active contest",
      };
    }
  }

  // Get contest by ID
  static async getContestById(id: string) {
    try {
      const contest = await prisma.contest.findUnique({
        where: { id },
        include: {
          sections: {
            include: {
              cards: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        },
      });

      if (!contest) {
        return {
          success: false,
          message: "Contest not found",
        };
      }

      return {
        success: true,
        data: contest,
      };
    } catch (error) {
      console.error("Error fetching contest:", error);
      return {
        success: false,
        message: "Failed to fetch contest",
      };
    }
  }

  // Create contest
  static async createContest(data: ContestFormData) {
    try {
      // If this contest is being set as active, deactivate others
      if (data.isActive) {
        await prisma.contest.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      const contest = await prisma.contest.create({
        data: {
          isActive: data.isActive,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
          sections: data.sections && data.sections.length > 0 ? {
            create: data.sections.map((section) => ({
              sectionType: section.sectionType,
              title: section.title || null,
              subtitle: section.subtitle || null,
              description: section.description || null,
              ctaText: section.ctaText || null,
              ctaUrl: section.ctaUrl || null,
              order: section.order,
              isVisible: section.isVisible ?? true,
              cards: section.cards && section.cards.length > 0 ? {
                create: section.cards.map((card) => ({
                  title: card.title,
                  description: card.description,
                  backgroundColor: card.backgroundColor,
                  order: card.order,
                  cardType: card.cardType || null,
                }))
              } : undefined,
            }))
          } : undefined,
        },
        include: {
          sections: {
            include: {
              cards: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        },
      });

      return {
        success: true,
        data: contest,
        message: "Contest created successfully",
      };
    } catch (error) {
      console.error("Error creating contest:", error);
      return {
        success: false,
        message: "Failed to create contest",
      };
    }
  }

  // Update contest
  static async updateContest(id: string, data: UpdateContestFormData) {
    try {
      // If this contest is being set as active, deactivate others
      if (data.isActive) {
        await prisma.contest.updateMany({
          where: {
            isActive: true,
            id: { not: id }
          },
          data: { isActive: false },
        });
      }

      // Handle sections update
      if (data.sections !== undefined) {
        // Delete existing sections and their cards (cascade will handle cards)
        await prisma.contestSection.deleteMany({
          where: { contestId: id }
        });

        // Create new sections if provided
        if (data.sections.length > 0) {
          for (const section of data.sections) {
            await prisma.contestSection.create({
              data: {
                contestId: id,
                sectionType: section.sectionType,
                title: section.title || null,
                subtitle: section.subtitle || null,
                description: section.description || null,
                ctaText: section.ctaText || null,
                ctaUrl: section.ctaUrl || null,
                order: section.order,
                isVisible: section.isVisible ?? true,
                cards: section.cards && section.cards.length > 0 ? {
                  create: section.cards.map((card) => ({
                    title: card.title,
                    description: card.description,
                    backgroundColor: card.backgroundColor,
                    order: card.order,
                    cardType: card.cardType || null,
                  }))
                } : undefined,
              },
            });
          }
        }
      }

      const contest = await prisma.contest.update({
        where: { id },
        data: {
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.startDate !== undefined && { startDate: data.startDate || null }),
          ...(data.endDate !== undefined && { endDate: data.endDate || null }),
        },
        include: {
          sections: {
            include: {
              cards: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        },
      });

      return {
        success: true,
        data: contest,
        message: "Contest updated successfully",
      };
    } catch (error) {
      console.error("Error updating contest:", error);
      return {
        success: false,
        message: "Failed to update contest",
      };
    }
  }

  // Delete contest
  static async deleteContest(id: string) {
    try {
      await prisma.contest.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Contest deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting contest:", error);
      return {
        success: false,
        message: "Failed to delete contest",
      };
    }
  }
}