"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DynamicForm from "../../_components/demo-denter-form/DynamicForm";

interface FormSchema {
  schema: {
    root: string[];
    entities: Record<string, any>;
  };
  gridChildren: Record<string, any[]>;
}

interface NewDemoCenterFormProps {
  businessSchema: FormSchema | null;
  residentialSchema: FormSchema | null;
}

export default function NewDemoCenterForm({
  businessSchema,
  residentialSchema,
}: NewDemoCenterFormProps) {
  const [activeTab, setActiveTab] = useState<"business" | "residential">(
    "business",
  );
  const [businessValues, setBusinessValues] = useState<Record<string, any>>({});
  const [residentialValues, setResidentialValues] = useState<
    Record<string, any>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    if (activeTab === "business") {
      setBusinessValues((prev) => ({ ...prev, [field]: value }));
    } else {
      setResidentialValues((prev) => ({ ...prev, [field]: value }));
    }
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = () => {
    const currentSchema =
      activeTab === "business" ? businessSchema : residentialSchema;
    const currentValues =
      activeTab === "business" ? businessValues : residentialValues;
    const newErrors: Record<string, string> = {};

    if (!currentSchema) return true;

    // Validate root level fields
    currentSchema.schema.root.forEach((entityId) => {
      const entity = currentSchema.schema.entities[entityId];
      if (entity && entity.attributes.required) {
        const fieldId = `field_${entityId}`;
        if (!currentValues[fieldId]) {
          newErrors[fieldId] =
            `${entity.attributes.label || "This field"} is required`;
        }
      }

      // Validate grid children
      if (entity && entity.type === "gridLayout") {
        const gridChildren = currentSchema.gridChildren[entityId] || [];
        gridChildren.forEach((child: any) => {
          if (child.required) {
            const fieldId = `field_${entityId}_${child.id}`;
            if (!currentValues[fieldId]) {
              newErrors[fieldId] = `${child.label || "This field"} is required`;
            }
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const currentValues =
        activeTab === "business" ? businessValues : residentialValues;

      // Submit to NEW API
      const response = await fetch(
        "/api/features/demo-centers/new-demo-centers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: activeTab,
            formData: currentValues,
            // userId: session?.user?.id, // Add if you have auth
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit");
      }

      const result = await response.json();
      toast.success(result.message || "Demo center submitted successfully!");

      // Reset form
      if (activeTab === "business") {
        setBusinessValues({});
      } else {
        setResidentialValues({});
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Demo Center (New)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Submit your facility information using our dynamic form builder
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "business" | "residential")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger
                value="residential"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Residential
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-6">
              <DynamicForm
                schema={businessSchema}
                values={businessValues}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="residential" className="mt-6">
              <DynamicForm
                schema={residentialSchema}
                values={residentialValues}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (activeTab === "business") {
                  setBusinessValues({});
                } else {
                  setResidentialValues({});
                }
                setErrors({});
              }}
            >
              Clear Form
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Demo Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
