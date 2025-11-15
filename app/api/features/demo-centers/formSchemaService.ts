import prisma from "@/lib/prisma";

export interface FormBuilderSchema {
  schema: any; // Builder schema from @coltorapps/builder
  gridChildren: Record<string, any[]>; // Nested children in grid layouts
}

const DEMO_CENTER_ID = "demo-center-1";

export class FormSchemaService {
  /**
   * Get form schema for a demo center
   */
  async getFormSchema(demoCenterId: string) {
    const schema = await prisma.demoCenterFormSchema.findUnique({
      where: { demoCenterId },
    });

    return schema;
  }

  /**
   * Save business form schema
   */
  async saveBusinessFormSchema(
    demoCenterId: string,
    formData: FormBuilderSchema,
  ) {
    const result = await prisma.demoCenterFormSchema.upsert({
      where: { demoCenterId },
      create: {
        demoCenterId,
        businessFormSchema: formData as any,
      },
      update: {
        businessFormSchema: formData as any,
      },
    });

    return result;
  }

  /**
   * Save residential form schema
   */
  async saveResidentialFormSchema(
    demoCenterId: string,
    formData: FormBuilderSchema,
  ) {
    const result = await prisma.demoCenterFormSchema.upsert({
      where: { demoCenterId },
      create: {
        demoCenterId,
        residentialFormSchema: formData as any,
      },
      update: {
        residentialFormSchema: formData as any,
      },
    });

    return result;
  }

  /**
   * Get business form schema
   */
  async getBusinessFormSchema(demoCenterId: string = DEMO_CENTER_ID) {
    const schema = await prisma.demoCenterFormSchema.findUnique({
      where: { demoCenterId },
      select: { businessFormSchema: true },
    });

    return schema?.businessFormSchema;
  }

  /**
   * Get residential form schema
   */
  async getResidentialFormSchema(demoCenterId: string = DEMO_CENTER_ID) {
    const schema = await prisma.demoCenterFormSchema.findUnique({
      where: { demoCenterId },
      select: { residentialFormSchema: true },
    });

    return schema?.residentialFormSchema;
  }
}

export const formSchemaService = new FormSchemaService();
