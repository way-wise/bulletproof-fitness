import { NextRequest, NextResponse } from "next/server";
import { pointTrackingService } from "./pointTrackingService";
import { RewardType } from "@prisma/client";

/**
 * GET - Get point transactions with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      userId: searchParams.get("userId") || undefined,
      actionType: searchParams.get("actionType") as RewardType | undefined,
      status: searchParams.get("status") as
        | "pending"
        | "approved"
        | "rejected"
        | undefined,
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const result = await pointTrackingService.getTransactions(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching point transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch point transactions" },
      { status: 500 },
    );
  }
}

/**
 * POST - Create a new point transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      actionType,
      referenceId,
      points,
      description,
      status,
      notes,
    } = body;

    // Validation
    if (!userId || !actionType || points === undefined || !description) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, actionType, points, description",
        },
        { status: 400 },
      );
    }

    const transaction = await pointTrackingService.createTransaction({
      userId,
      actionType,
      referenceId,
      points,
      description,
      status,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Point transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating point transaction:", error);
    return NextResponse.json(
      { error: "Failed to create point transaction" },
      { status: 500 },
    );
  }
}
