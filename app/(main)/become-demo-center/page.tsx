"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FieldDefinition {
  id: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  layout?: string;
}

export default function BecomeDemoCenterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"business" | "residential">(
    "business",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();

  // Fetch form schema based on selected type
  const { data: formSchema } = useSWR(
    `/api/demo-centers/form-schema/${selectedType}`,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    },
  );

  const fields: FieldDefinition[] = formSchema?.schema?.fields || [];

  // Handle file upload to Cloudinary
  const handleFileUpload = async (
    fieldName: string,
    file: File,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo_centers");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Failed to upload file");

    const data = await res.json();
    return data.secure_url;
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Upload files first
      const fileFields = fields.filter((f) => f.type === "file");
      for (const field of fileFields) {
        const fileInput = document.querySelector(
          `input[name="${field.name}"]`,
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          const url = await handleFileUpload(field.name, fileInput.files[0]);
          data[field.name] = url;
        }
      }

      // Add building type to form data
      data.buildingType = selectedType;

      // Submit form data
      const res = await fetch(`/api/demo-centers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: data,
          buildingType: selectedType,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      router.push("/demo-centers");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FieldDefinition) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Input
              {...form.register(field.name, { required: field.required })}
              placeholder={field.placeholder}
            />
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Textarea
              {...form.register(field.name, { required: field.required })}
              placeholder={field.placeholder}
              rows={4}
            />
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Select onValueChange={(value) => form.setValue(field.name, value)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {(field.options || []).map((option, idx) => (
                  <SelectItem key={idx} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Input type="file" name={field.name} accept="image/*" />
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        );

      case "layout":
        return (
          <div
            key={field.id}
            className={`grid gap-4 ${
              field.layout === "2x"
                ? "grid-cols-1 md:grid-cols-2"
                : field.layout === "3x"
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1"
            }`}
          >
            {/* Layout divider */}
          </div>
        );

      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center p-6">
            <div className="text-center text-muted-foreground">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
              <p>Loading form...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Become a Demo Center</h1>
        <p className="mt-2 text-muted-foreground">
          Join our network of demo centers and showcase Bulletproof Fitness
          equipment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your type and fill out the form below
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as "business" | "residential")
            }
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="residential">Residential</TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">{fields.map(renderField)}</div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Business Application"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="residential" className="mt-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">{fields.map(renderField)}</div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Residential Application"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
