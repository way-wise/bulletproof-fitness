import { NextRequest, NextResponse } from "next/server";
import { formSchemaService } from "../../formSchemaService";
import prisma from "@/lib/prisma";

const DEMO_CENTER_ID = "demo-center-1";

// Ensure demo center exists before saving schema
async function ensureDemoCenterExists() {
  const existing = await prisma.demoCenter.findUnique({
    where: { id: DEMO_CENTER_ID },
  });

  if (!existing) {
    await prisma.demoCenter.create({
      data: {
        id: DEMO_CENTER_ID,
        buildingType: "BUSINESS",
        name: "Default Demo Center",
        address: "123 Main St",
        contact: "555-0100",
        cityZip: "New York, NY 10001",
        bio: "Default demo center for form builder",
        image: "https://via.placeholder.com/400",
        weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        weekends: ["Saturday", "Sunday"],
        weekdayOpen: "9:00 AM",
        weekdayClose: "5:00 PM",
        weekendOpen: "10:00 AM",
        weekendClose: "4:00 PM",
        isPublic: false,
        blocked: false,
      },
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formType: string }> },
) {
  try {
    const { formType } = await params;

    if (formType !== "business" && formType !== "residential") {
      return NextResponse.json(
        { error: "Invalid form type. Must be 'business' or 'residential'" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { schema, gridChildren } = body;

    if (!schema) {
      return NextResponse.json(
        { error: "Schema is required" },
        { status: 400 },
      );
    }

    // Ensure demo center exists before saving
    await ensureDemoCenterExists();

    const formData = {
      schema,
      gridChildren: gridChildren || {},
    };

    let result;
    if (formType === "business") {
      result = await formSchemaService.saveBusinessFormSchema(
        DEMO_CENTER_ID,
        formData,
      );
    } else {
      result = await formSchemaService.saveResidentialFormSchema(
        DEMO_CENTER_ID,
        formData,
      );
    }

    return NextResponse.json({
      success: true,
      message: `${formType === "business" ? "Business" : "Residential"} form schema saved successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error saving form schema:", error);
    return NextResponse.json(
      { error: "Failed to save form schema" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formType: string }> },
) {
  try {
    const { formType } = await params;

    if (formType !== "business" && formType !== "residential") {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    let schema;
    if (formType === "business") {
      schema = await formSchemaService.getBusinessFormSchema();
    } else {
      schema = await formSchemaService.getResidentialFormSchema();
    }

    return NextResponse.json({
      success: true,
      data: schema || null,
    });
  } catch (error) {
    console.error("Error fetching form schema:", error);
    return NextResponse.json(
      { error: "Failed to fetch form schema" },
      { status: 500 },
    );
  }
}
