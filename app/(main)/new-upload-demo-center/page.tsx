import NewDemoCenterForm from "./_components/NewDemoCenterForm";

interface FormSchema {
  schema: {
    root: string[];
    entities: Record<string, any>;
  };
  gridChildren: Record<string, any[]>;
}

async function getFormSchemas() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Fetch both schemas in parallel
    const [businessRes, residentialRes] = await Promise.all([
      fetch(`${baseUrl}/api/features/demo-centers/form-schema/business`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/features/demo-centers/form-schema/residential`, {
        cache: "no-store",
      }),
    ]);

    let businessSchema: FormSchema | null = null;
    let residentialSchema: FormSchema | null = null;

    if (businessRes.ok) {
      const businessData = await businessRes.json();
      businessSchema = businessData.data || null;
    }

    if (residentialRes.ok) {
      const residentialData = await residentialRes.json();
      residentialSchema = residentialData.data || null;
    }

    return { businessSchema, residentialSchema };
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
