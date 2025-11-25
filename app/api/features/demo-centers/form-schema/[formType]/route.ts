import { NextRequest, NextResponse } from "next/server";
import { formSchemaService } from "../../formSchemaService";
import prisma from "@/lib/prisma";

// Transform builder schema to public form format
function transformBuilderSchemaToFields(schema: any): any[] {
  if (!schema?.entities || !schema?.root) {
    return [];
  }

  const fields: any[] = [];

  // Process entities in root order
  schema.root.forEach((entityId: string) => {
    const entity = schema.entities[entityId];
    if (!entity) return;

    // Map entity types to field types
    const fieldTypeMap: Record<string, string> = {
      textField: "text",
      textareaField: "textarea",
      selectField: "select",
      checkboxField: "checkbox",
      checkboxGroupField: "checkboxGroup",
      fileField: "file",
      locationField: "text", // Treat location as text for now
      gridLayout: "layout",
    };

    const fieldType = fieldTypeMap[entity.type] || entity.type;

    const field = {
      id: entityId,
      type: fieldType,
      label: entity.attributes?.label || "Field",
      name: entityId,
      placeholder: entity.attributes?.placeholder || "",
      required: entity.attributes?.required || false,
      options: entity.attributes?.options || [],
      layout: entity.attributes?.columns || "1x",
    };

    fields.push(field);
  });

  return fields;
}

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

    console.log("DEBUG: Raw schema from database:", schema);

    // Transform builder schema to public form format
    const schemaData = typeof schema === "string" ? JSON.parse(schema) : schema;
    console.log("DEBUG: Parsed schema data:", schemaData);

    const transformedFields = transformBuilderSchemaToFields(
      schemaData?.schema,
    );
    console.log("DEBUG: Transformed fields:", transformedFields);

    return NextResponse.json({
      success: true,
      schema: {
        fields: transformedFields,
      },
    });
  } catch (error) {
    console.error("Error fetching form schema:", error);
    return NextResponse.json(
      { error: "Failed to fetch form schema" },
      { status: 500 },
    );
  }
}
