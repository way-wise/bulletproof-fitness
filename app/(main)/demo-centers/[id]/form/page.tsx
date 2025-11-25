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
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
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

export default function DemoCenterFormPage() {
  const params = useParams();
  const router = useRouter();
  const demoCenterId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>(
    {},
  );

  const form = useForm();

  // Fetch demo center details
  const { data: demoCenter } = useSWR(
    `/api/demo-centers/${demoCenterId}`,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch demo center");
      return res.json();
    },
  );

  // Fetch form schema based on building type
  const { data: formSchema } = useSWR(
    demoCenter?.buildingType
      ? `/api/demo-centers/form-schema/${demoCenter.buildingType.toLowerCase()}`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    },
  );

  const fields: FieldDefinition[] = formSchema?.schema?.fields || [];

  // Handle file upload
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

      // Submit form data
      const res = await fetch(`/api/demo-centers/${demoCenterId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: data,
          buildingType: demoCenter.buildingType,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit form");
      }

      toast.success("Form submitted successfully!");
      router.push(`/demo-centers/${demoCenterId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit form");
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

      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={form.watch(field.name) || false}
                onCheckedChange={(checked) =>
                  form.setValue(field.name, checked)
                }
              />
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
            </div>
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        );

      case "checkboxGroup":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <div className="space-y-2">
              {(field.options || []).map((option, idx) => {
                const optionId = `${field.name}_${idx}`;
                const currentValue = form.watch(field.name) || [];
                const isChecked = currentValue.includes(option.value);

                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={optionId}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...currentValue, option.value]
                          : currentValue.filter(
                              (v: string) => v !== option.value,
                            );
                        form.setValue(field.name, newValue);
                      }}
                    />
                    <Label htmlFor={optionId} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
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

  if (!demoCenter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center p-6">
            <div className="text-center text-muted-foreground">
              <p>Form not available yet</p>
              <p className="mt-2 text-sm">
                Please check back later or contact support
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>
            {demoCenter.buildingType === "Business"
              ? "Business"
              : "Residential"}{" "}
            Demo Center Application
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to apply for demo center status
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
