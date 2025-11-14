import prisma from "@/lib/prisma";

export interface FormSubmissionData {
  demoCenterId: string;
  userId?: string;
  formData: Record<string, any>;
}

export class FormSubmissionService {
  /**
   * Create a new form submission
   */
  async createSubmission(data: FormSubmissionData) {
    const submission = await prisma.demoCenterFormSubmission.create({
      data: {
        demoCenterId: data.demoCenterId,
        userId: data.userId,
        values: data.formData as any,
        status: "pending",
      },
      include: {
        demoCenter: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return submission;
  }

  /**
   * Get all submissions for a demo center
   */
  async getSubmissionsByDemoCenter(demoCenterId: string) {
    const submissions = await prisma.demoCenterFormSubmission.findMany({
      where: { demoCenterId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return submissions;
  }

  /**
   * Get all submissions (admin)
   */
  async getAllSubmissions(filters?: { status?: string }) {
    const submissions = await prisma.demoCenterFormSubmission.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        demoCenter: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return submissions;
  }

  /**
   * Update submission status
   */
  async updateSubmissionStatus(
    submissionId: string,
    status: "pending" | "approved" | "rejected",
  ) {
    const submission = await prisma.demoCenterFormSubmission.update({
      where: { id: submissionId },
      data: { status },
      include: {
        demoCenter: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return submission;
  }

  /**
   * Get submission by ID
   */
  async getSubmissionById(submissionId: string) {
    const submission = await prisma.demoCenterFormSubmission.findUnique({
      where: { id: submissionId },
      include: {
        demoCenter: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return submission;
  }
}

export const formSubmissionService = new FormSubmissionService();
