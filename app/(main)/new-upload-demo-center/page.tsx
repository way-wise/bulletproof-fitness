import NewDemoCenterForm from "./_components/NewDemoCenterForm";
import { formSchemaService } from "@/app/api/features/demo-centers/formSchemaService";

interface FormSchema {
  schema: {
    root: string[];
    entities: Record<string, any>;
  };
  gridChildren: Record<string, any[]>;
}

async function getFormSchemas() {
  try {
    // Call service directly in server component - no need for HTTP fetch
    const [businessSchema, residentialSchema] = await Promise.all([
      formSchemaService.getBusinessFormSchema(),
      formSchemaService.getResidentialFormSchema(),
    ]);

    console.log(
      "[getFormSchemas] Business schema:",
      businessSchema ? "loaded" : "null",
    );
    console.log(
      "[getFormSchemas] Residential schema:",
      residentialSchema ? "loaded" : "null",
    );

    return {
      businessSchema: businessSchema as FormSchema | null,
      residentialSchema: residentialSchema as FormSchema | null,
    };
  } catch (error) {
    console.error("Error loading form schemas:", error);
    return { businessSchema: null, residentialSchema: null };
  }
}

export default async function NewDemoCenterFormPage() {
  const { businessSchema, residentialSchema } = await getFormSchemas();

  return (
    <NewDemoCenterForm
      businessSchema={businessSchema}
      residentialSchema={residentialSchema}
    />
  );
}
