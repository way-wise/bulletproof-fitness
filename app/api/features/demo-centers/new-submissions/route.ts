import { NextRequest, NextResponse } from "next/server";
import { newDemoCenterService } from "../newDemoCenterService";
import { formSchemaService } from "../formSchemaService";

/**
 * POST - Create a new demo center submission
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formData, userId } = body;

    // Validate type
    if (type !== "business" && type !== "residential") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'business' or 'residential'" },
        { status: 400 },
      );
    }

    if (!formData) {
      return NextResponse.json(
        { error: "Form data is required" },
        { status: 400 },
      );
    }

    // Load the form schema to validate required fields
    let schema;
    if (type === "business") {
      schema = await formSchemaService.getBusinessFormSchema();
    } else {
      schema = await formSchemaService.getResidentialFormSchema();
    }

    // Validate required fields if schema exists
    if (schema) {
      const validation = newDemoCenterService.validateRequiredFields(
        formData,
        schema as any,
      );

      if (!validation.valid) {
        return NextResponse.json(
          {
            error: "Validation failed",
            errors: validation.errors,
          },
          { status: 400 },
        );
      }
    }

    // Create the submission
    const result = await newDemoCenterService.createNewDemoCenter({
      type,
      details: formData,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Demo center submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating demo center submission:", error);
    return NextResponse.json(
      { error: "Failed to create demo center submission" },
      { status: 500 },
    );
  }
}

/**
 * GET - Get all demo center submissions with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      type: searchParams.get("type") as "business" | "residential" | undefined,
      status: searchParams.get("status") || undefined,
      userId: searchParams.get("userId") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const result = await newDemoCenterService.getNewDemoCenters(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching demo center submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo center submissions" },
      { status: 500 },
    );
  }
}
