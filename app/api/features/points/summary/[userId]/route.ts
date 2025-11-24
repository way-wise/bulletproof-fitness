import { NextRequest, NextResponse } from "next/server";
import { pointTrackingService } from "../../pointTrackingService";

/**
 * GET - Get user's point summary with statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;

    const summary = await pointTrackingService.getUserPointSummary(userId);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching user point summary:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user point summary",
      },
      { status: 500 },
    );
  }
}
