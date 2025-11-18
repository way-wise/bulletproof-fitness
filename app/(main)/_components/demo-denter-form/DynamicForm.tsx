"use client";

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
import { Upload } from "lucide-react";
import { useState } from "react";
import LocationInput from "./LocationInput";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

interface GridChild extends FormField {
  columnIndex: number;
}

interface FormSchema {
  schema: {
    root: string[];
    entities: Record<
      string,
      {
        type: string;
        attributes: {
          label?: string;
          placeholder?: string;
          required?: boolean;
          options?: { label: string; value: string }[];
          columns?: string;
          gap?: string;
        };
      }
    >;
  };
  gridChildren: Record<string, GridChild[]>;
}

interface DynamicFormProps {
  schema: FormSchema | null;
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function DynamicForm({
  schema,
  values,
  onChange,
  errors = {},
}: DynamicFormProps) {
  if (!schema || !schema.schema || !schema.schema.entities) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>No form schema available. Please contact support.</p>
      </div>
    );
  }

  const renderField = (entityId: string) => {
    const entity = schema.schema.entities[entityId];
    if (!entity) return null;

    const { type, attributes } = entity;
    const label = attributes.label || "Field";
    const placeholder = attributes.placeholder || "";
    const required = attributes.required || false;
    const fieldId = `field_${entityId}`;
    const error = errors[fieldId];

    switch (type) {
      case "textField":
        return (
          <div key={entityId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Label>
            <Input
              id={fieldId}
              placeholder={placeholder}
              value={values[fieldId] || ""}
              onChange={(e) => onChange(fieldId, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "textareaField":
        return (
          <div key={entityId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Label>
            <Textarea
              id={fieldId}
              placeholder={placeholder}
              value={values[fieldId] || ""}
              onChange={(e) => onChange(fieldId, e.target.value)}
              rows={4}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "selectField":
        const options = attributes.options || [];
        return (
          <div key={entityId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Label>
            <Select
              value={values[fieldId] || ""}
              onValueChange={(value) => onChange(fieldId, value)}
            >
              <SelectTrigger
                className={`w-full ${error ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder={placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, idx) => (
                  <SelectItem key={idx} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "fileField":
        return (
          <div key={entityId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Label>
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary ${error ? "border-red-500" : "border-muted-foreground/30"}`}
              onClick={() => document.getElementById(fieldId)?.click()}
            >
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {placeholder || "Click to upload file"}
              </p>
              {values[fieldId] && (
                <p className="mt-2 text-sm font-medium">
                  {values[fieldId].name}
                </p>
              )}
            </div>
            <input
              id={fieldId}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(fieldId, file);
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "locationField":
        return (
          <div key={entityId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Label>
            <LocationInput
              value={values[fieldId]}
              onChange={(location) => onChange(fieldId, location)}
              placeholder={placeholder}
              error={!!error}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "gridLayout":
        const columns = parseInt(attributes.columns || "1");
        const gap = attributes.gap || "md";
        const gapClass =
          gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
        const gridChildren = schema.gridChildren[entityId] || [];

        return (
          <div
            key={entityId}
            className={`grid ${gapClass} ${
              columns === 2
                ? "grid-cols-2"
                : columns === 3
                  ? "grid-cols-3"
                  : "grid-cols-1"
            }`}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => {
              const columnChildren = gridChildren.filter(
                (child) => child.columnIndex === columnIndex,
              );

              return (
                <div key={columnIndex} className="space-y-4">
                  {columnChildren.map((child) =>
                    renderNestedField(entityId, child),
                  )}
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const renderNestedField = (gridId: string, field: GridChild) => {
    const fieldId = `field_${gridId}_${field.id}`;
    const error = errors[fieldId];

    switch (field.type) {
      case "textField":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Input
              id={fieldId}
              placeholder={field.placeholder}
              value={values[fieldId] || ""}
              onChange={(e) => onChange(fieldId, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "textareaField":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Textarea
              id={fieldId}
              placeholder={field.placeholder}
              value={values[fieldId] || ""}
              onChange={(e) => onChange(fieldId, e.target.value)}
              rows={3}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "selectField":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <Select
              value={values[fieldId] || ""}
              onValueChange={(value) => onChange(fieldId, value)}
            >
              <SelectTrigger
                className={`w-full ${error ? "border-red-500" : ""}`}
              >
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "fileField":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary ${error ? "border-red-500" : "border-muted-foreground/30"}`}
              onClick={() => document.getElementById(fieldId)?.click()}
            >
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {field.placeholder || "Upload file"}
              </p>
              {values[fieldId] && (
                <p className="mt-1 text-xs font-medium">
                  {values[fieldId].name}
                </p>
              )}
            </div>
            <input
              id={fieldId}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(fieldId, file);
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "locationField":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>
            <LocationInput
              value={values[fieldId]}
              onChange={(location) => onChange(fieldId, location)}
              placeholder={field.placeholder}
              error={!!error}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {schema.schema.root.map((entityId) => renderField(entityId))}
    </div>
  );
}
