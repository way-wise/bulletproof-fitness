import { NextRequest, NextResponse } from "next/server";
import { pointTrackingService } from "../../pointTrackingService";

/**
 * PATCH - Approve or reject a pending transaction
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, approvedBy, notes } = body;

    if (!action || !approvedBy) {
      return NextResponse.json(
        { error: "Missing required fields: action, approvedBy" },
        { status: 400 },
      );
    }

    let result;
    if (action === "approve") {
      result = await pointTrackingService.approveTransaction(
        id,
        approvedBy,
        notes,
      );
    } else if (action === "reject") {
      result = await pointTrackingService.rejectTransaction(
        id,
        approvedBy,
        notes,
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transaction ${action}d successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update transaction",
      },
      { status: 500 },
    );
  }
}

/**
 * GET - Get user's transactions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    const filters = {
      userId: id,
      actionType: (searchParams.get("actionType") as any) || undefined,
      status: searchParams.get("status") as
        | "pending"
        | "approved"
        | "rejected"
        | undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const transactions = await pointTrackingService.getTransactions(filters);

    return NextResponse.json({
      success: true,
      data: transactions.data,
      pagination: transactions.pagination,
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user transactions" },
      { status: 500 },
    );
  }
}
