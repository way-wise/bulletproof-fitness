import { NextRequest, NextResponse } from "next/server";
import { newDemoCenterService } from "../../newDemoCenterService";

/**
 * GET - Get a single demo center submission by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await newDemoCenterService.getNewDemoCenterById(id);

    if (!result) {
      return NextResponse.json(
        { error: "Demo center submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching demo center submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo center submission" },
      { status: 500 },
    );
  }
}

/**
 * PATCH - Update a demo center submission
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { details, status } = body;

    const updateData: any = {};
    if (details) updateData.details = details;
    if (status) updateData.status = status;

    const result = await newDemoCenterService.updateNewDemoCenter(
      id,
      updateData,
    );

    return NextResponse.json({
      success: true,
      message: "Demo center submission updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating demo center submission:", error);
    return NextResponse.json(
      { error: "Failed to update demo center submission" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Delete a demo center submission
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await newDemoCenterService.deleteNewDemoCenter(id);

    return NextResponse.json({
      success: true,
      message: "Demo center submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting demo center submission:", error);
    return NextResponse.json(
      { error: "Failed to delete demo center submission" },
      { status: 500 },
    );
  }
}
