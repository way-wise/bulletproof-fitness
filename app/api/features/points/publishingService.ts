import { pointTrackingService } from "./pointTrackingService";

/**
 * Service to handle point approvals when content is published
 */
export class PublishingService {
  /**
   * Auto-approve pending points when content becomes public
   */
  async approvePointsForPublishedContent(contentId: string, adminId: string) {
    try {
      const approvedTransactions =
        await pointTrackingService.approveTransactionsForContent(
          contentId,
          adminId,
        );

      console.log(
        `Approved ${approvedTransactions.length} point transactions for published content: ${contentId}`,
      );

      return {
        success: true,
        approved: approvedTransactions.length,
        transactions: approvedTransactions,
      };
    } catch (error) {
      console.error("Error approving points for published content:", error);
      throw error;
    }
  }

  /**
   * Reject pending points when content is rejected/deleted
   */
  async rejectPointsForContent(
    contentId: string,
    adminId: string,
    reason?: string,
  ) {
    try {
      const rejectedTransactions =
        await pointTrackingService.rejectTransactionsForContent(
          contentId,
          adminId,
          reason || "Content rejected or deleted",
        );

      console.log(
        `Rejected ${rejectedTransactions.length} point transactions for content: ${contentId}`,
      );

      return {
        success: true,
        rejected: rejectedTransactions.length,
        transactions: rejectedTransactions,
      };
    } catch (error) {
      console.error("Error rejecting points for content:", error);
      throw error;
    }
  }
}

export const publishingService = new PublishingService();
