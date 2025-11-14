"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BuilderEntities,
  BuilderEntityAttributes,
  useBuilderStore,
  createAttributeComponent,
  createEntityComponent,
} from "@coltorapps/builder-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Type,
  FileText,
  List,
  Image,
  Edit,
  Trash2,
  Plus,
  X,
  LayoutGrid,
  GripVertical,
} from "lucide-react";
import { demoCenterFormBuilder } from "@/lib/form-builder/demo-center-form-builder";
import { labelAttribute } from "@/lib/form-builder/attributes/label";
import { placeholderAttribute } from "@/lib/form-builder/attributes/placeholder";
import { requiredAttribute } from "@/lib/form-builder/attributes/required";
import { optionsAttribute } from "@/lib/form-builder/attributes/options";
import { columnsAttribute } from "@/lib/form-builder/attributes/columns";
import { gapAttribute } from "@/lib/form-builder/attributes/gap";
import { textFieldEntity } from "@/lib/form-builder/entities/text-field";
import { textareaFieldEntity } from "@/lib/form-builder/entities/textarea-field";
import { selectFieldEntity } from "@/lib/form-builder/entities/select-field";
import { fileFieldEntity } from "@/lib/form-builder/entities/file-field";
import { gridLayoutEntity } from "@/lib/form-builder/entities/grid-layout";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  MouseSensor,
  useSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuilderStoreData } from "@coltorapps/builder-react";

// Attribute Components
const LabelAttribute = createAttributeComponent(labelAttribute, (props) => {
  return (
    <div className="space-y-2">
      <Label className="mb-1 block text-sm">Label</Label>
      <Input
        value={(props.attribute.value as string) ?? ""}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Field label"
      />
    </div>
  );
});

const PlaceholderAttribute = createAttributeComponent(
  placeholderAttribute,
  (props) => {
    return (
      <div className="space-y-2">
        <Label className="mb-1 block text-sm">Placeholder</Label>
        <Input
          value={(props.attribute.value as string) ?? ""}
          onChange={(e) => props.setValue(e.target.value)}
          placeholder="Placeholder text"
        />
      </div>
    );
  },
);

const RequiredAttribute = createAttributeComponent(
  requiredAttribute,
  (props) => {
    return (
      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label className="text-sm">Required Field</Label>
        <Switch
          checked={(props.attribute.value as boolean) ?? false}
          onCheckedChange={(checked) => props.setValue(checked)}
        />
      </div>
    );
  },
);

const OptionsAttribute = createAttributeComponent(optionsAttribute, (props) => {
  const options = (props.attribute.value as any[]) || [];

  const addOption = useCallback(() => {
    const newIndex = options.length + 1;
    props.setValue([
      ...options,
      { label: `Option ${newIndex}`, value: `option${newIndex}` },
    ]);
  }, [options, props]);

  const updateOption = (index: number, key: string, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    props.setValue(newOptions);
  };

  const removeOption = (index: number) => {
    props.setValue(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label className="mb-2 block text-sm">Options</Label>
      <div className="space-y-2">
        {options.map((option: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(e) => updateOption(index, "label", e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeOption(index);
                }}
                className="h-9 w-9 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={option.value}
              onChange={(e) => updateOption(index, "value", e.target.value)}
              placeholder={`option${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addOption();
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
      </div>
    </div>
  );
});

const ColumnsAttribute = createAttributeComponent(columnsAttribute, (props) => {
  return (
    <div className="space-y-2">
      <Label className="mb-1 block text-sm">Columns</Label>
      <Select
        value={(props.attribute.value as string) || "1"}
        onValueChange={(value) => props.setValue(value as "1" | "2" | "3")}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Column</SelectItem>
          <SelectItem value="2">2 Columns</SelectItem>
          <SelectItem value="3">3 Columns</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

const GapAttribute = createAttributeComponent(gapAttribute, (props) => {
  return (
    <div className="space-y-2">
      <Label className="mb-1 block text-sm">Gap Size</Label>
      <Select
        value={(props.attribute.value as string) || "md"}
        onValueChange={(value) => props.setValue(value as "sm" | "md" | "lg")}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sm">Small</SelectItem>
          <SelectItem value="md">Medium</SelectItem>
          <SelectItem value="lg">Large</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

// Entity Components
const TextFieldEntity = createEntityComponent(textFieldEntity, (props) => {
  const label = props.entity.attributes.label as string;
  const placeholder = props.entity.attributes.placeholder as string;
  const required = props.entity.attributes.required as boolean;

  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label || "Text Field"}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Input placeholder={placeholder} disabled />
    </div>
  );
});

const TextareaFieldEntity = createEntityComponent(
  textareaFieldEntity,
  (props) => {
    const label = props.entity.attributes.label as string;
    const placeholder = props.entity.attributes.placeholder as string;
    const required = props.entity.attributes.required as boolean;

    return (
      <div className="space-y-2">
        <Label className="text-sm">
          {label || "Textarea Field"}
          {required && <span className="text-red-500"> *</span>}
        </Label>
        <textarea
          placeholder={placeholder}
          disabled
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  },
);

const SelectFieldEntity = createEntityComponent(selectFieldEntity, (props) => {
  const label = props.entity.attributes.label as string;
  const placeholder = props.entity.attributes.placeholder as string;
  const required = props.entity.attributes.required as boolean;
  const options = (props.entity.attributes.options as any[]) || [];

  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label || "Select Field"}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((opt: any) => opt.value)
            .map((opt: any, idx: number) => (
              <SelectItem key={idx} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
});

const FileFieldEntity = createEntityComponent(fileFieldEntity, (props) => {
  const label = props.entity.attributes.label as string;
  const placeholder = props.entity.attributes.placeholder as string;
  const required = props.entity.attributes.required as boolean;

  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label || "File Upload"}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="relative">
        <input
          type="file"
          disabled
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        <div className="flex min-h-[100px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10 p-4 text-center transition-colors hover:border-primary/50">
          <div>
            <Image className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {placeholder || "Upload your file here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

const GridLayoutEntityWrapper = ({
  entity,
  gridChildren,
  onDropInColumn,
  onDeleteFromColumn,
  onSelectField,
}: any) => {
  const columns = (entity.attributes.columns as string) || "1";
  const gap = (entity.attributes.gap as string) || "md";
  const children = gridChildren[entity.id] || [];

  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-muted-foreground">
        Grid Layout ({columns} {parseInt(columns) === 1 ? "Column" : "Columns"})
      </Label>
      <div
        className={`grid ${gapClass} ${
          columns === "2"
            ? "grid-cols-2"
            : columns === "3"
              ? "grid-cols-3"
              : "grid-cols-1"
        }`}
      >
        {Array.from({ length: parseInt(columns) }).map((_, columnIndex) => {
          const columnChildren = children.filter(
            (child: any) => child.columnIndex === columnIndex,
          );

          return (
            <div
              key={columnIndex}
              className="min-h-[100px] rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/10 p-2 transition-colors hover:border-primary/50"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDropInColumn(entity.id, columnIndex, e);
              }}
            >
              {columnChildren.length === 0 ? (
                <div className="flex h-full min-h-[80px] items-center justify-center text-center text-muted-foreground">
                  <div>
                    <Plus className="mx-auto mb-1 h-5 w-5" />
                    <p className="text-xs">Drop field here</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {columnChildren.map((child: any) => (
                    <div
                      key={child.id}
                      className="group relative rounded border bg-background p-2 hover:border-primary/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectField(child.id);
                      }}
                    >
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectField(child.id);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFromColumn(entity.id, child.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="pr-12">
                        <Label className="text-xs">
                          {child.label || "Field"}
                          {child.required && (
                            <span className="text-red-500"> *</span>
                          )}
                        </Label>
                        <Input
                          placeholder={child.placeholder}
                          disabled
                          className="mt-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GridLayoutEntity = createEntityComponent(gridLayoutEntity, (props) => {
  // This is just a placeholder - actual rendering happens in the wrapper
  return <div>Grid Layout</div>;
});

// Attribute Groups
function TextFieldAttributes() {
  return (
    <div className="space-y-4">
      <LabelAttribute />
      <PlaceholderAttribute />
      <RequiredAttribute />
    </div>
  );
}

function TextareaFieldAttributes() {
  return (
    <div className="space-y-4">
      <LabelAttribute />
      <PlaceholderAttribute />
      <RequiredAttribute />
    </div>
  );
}

function SelectFieldAttributes() {
  return (
    <div className="space-y-4">
      <LabelAttribute />
      <PlaceholderAttribute />
      <RequiredAttribute />
      <OptionsAttribute />
    </div>
  );
}

function FileFieldAttributes() {
  return (
    <div className="space-y-4">
      <LabelAttribute />
      <RequiredAttribute />
    </div>
  );
}

function GridLayoutAttributes() {
  return (
    <div className="space-y-4">
      <ColumnsAttribute />
      <GapAttribute />
    </div>
  );
}

export default function FormBuilderPage() {
  const [activeEntityId, setActiveEntityId] = useState<string | undefined>();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeTab, setActiveTab] = useState<"business" | "residential">(
    "business",
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = (value: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(value as "business" | "residential");
      setIsAnimating(false);
    }, 150);
  };
  const [gridChildren, setGridChildren] = useState<Record<string, any[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const builderStore = useBuilderStore(demoCenterFormBuilder);

  // Subscribe to root order changes for DnD
  const {
    schema: { root },
  } = useBuilderStoreData(builderStore, (events) =>
    events.some((e) => e.name === "RootUpdated"),
  );

  // Load from session storage on mount and tab change
  useEffect(() => {
    // Clear active entity when switching tabs to avoid stale ID errors
    setActiveEntityId(undefined);

    const sessionKey = `formBuilder_${activeTab}`;
    const savedData = sessionStorage.getItem(sessionKey);

    if (savedData) {
      try {
        const { schema, gridChildren: savedGridChildren } =
          JSON.parse(savedData);

        // Clear existing entities first
        const currentEntities = builderStore.getSchema().entities;
        Object.keys(currentEntities).forEach((id) => {
          try {
            builderStore.deleteEntity(id);
          } catch (e) {
            // Ignore errors when deleting entities
          }
        });

        // Clear grid children
        setGridChildren({});

        // Load schema into builder if it exists
        if (
          schema &&
          schema.entities &&
          Object.keys(schema.entities).length > 0
        ) {
          // Create a map to store entity IDs (old ID -> new ID)
          const idMap: Record<string, string> = {};

          // Load saved entities in the order specified by root array
          if (schema.root && Array.isArray(schema.root)) {
            schema.root.forEach((oldId: string) => {
              const entity = schema.entities[oldId];
              if (entity) {
                try {
                  const newEntity = builderStore.addEntity({
                    type: entity.type,
                    attributes: entity.attributes,
                  });
                  idMap[oldId] = newEntity.id;
                } catch (e) {
                  console.error("Error adding entity:", e);
                }
              }
            });
          } else {
            // Fallback: load entities without specific order
            Object.values(schema.entities).forEach((entity: any) => {
              try {
                builderStore.addEntity({
                  type: entity.type,
                  attributes: entity.attributes,
                });
              } catch (e) {
                console.error("Error adding entity:", e);
              }
            });
          }
        }

        // Load grid children
        if (savedGridChildren) {
          setGridChildren(savedGridChildren);
        }
      } catch (error) {
        console.error("Error loading from session:", error);
      }
    } else {
      // No saved data, clear everything
      const currentEntities = builderStore.getSchema().entities;
      Object.keys(currentEntities).forEach((id) => {
        try {
          builderStore.deleteEntity(id);
        } catch (e) {
          // Ignore errors
        }
      });
      setGridChildren({});
    }
  }, [activeTab]);

  // Save to session storage whenever data changes
  useEffect(() => {
    const sessionKey = `formBuilder_${activeTab}`;
    const dataToSave = {
      schema: builderStore.getSchema(),
      gridChildren,
    };

    sessionStorage.setItem(sessionKey, JSON.stringify(dataToSave));
  }, [builderStore.getSchema(), gridChildren, activeTab]);

  // DnD sensors and handlers
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  function handleRootDragEnd(e: DragEndEvent) {
    const overId = e.over?.id;
    if (!overId || typeof e.active.id !== "string") return;
    const newIndex = root.findIndex((id) => id === overId);
    if (newIndex >= 0) {
      builderStore.setEntityIndex(e.active.id, newIndex);
    }
  }

  const saveFormSchema = async () => {
    try {
      setIsSaving(true);
      const schema = builderStore.getSchema();

      const res = await fetch(
        `/api/features/demo-centers/form-schema/${activeTab}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schema,
            gridChildren,
          }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      const result = await res.json();
      toast.success(result.message || "Form template saved successfully");

      // Keep session storage for now - only clear on explicit user action if needed
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save form template");
    } finally {
      setIsSaving(false);
    }
  };

  const fieldTypes = [
    { type: "textField", label: "Text Input", icon: Type },
    { type: "textareaField", label: "Text Area", icon: FileText },
    { type: "selectField", label: "Dropdown", icon: List },
    { type: "fileField", label: "File Upload", icon: Image },
    { type: "gridLayout", label: "Grid Layout", icon: LayoutGrid },
  ];

  // Handle dropping field into grid column
  const handleDropInColumn = (
    gridId: string,
    columnIndex: number,
    e: React.DragEvent,
  ) => {
    const fieldType = e.dataTransfer.getData("fieldType");
    if (!fieldType || fieldType === "gridLayout") return; // Can't nest grids

    const newChild = {
      id: Math.random().toString(36).substring(7),
      type: fieldType,
      label: fieldTypes.find((f) => f.type === fieldType)?.label || "Field",
      placeholder: "",
      required: false,
      columnIndex,
      ...(fieldType === "selectField" && {
        options: [{ label: "Option 1", value: "option1" }],
      }),
    };

    setGridChildren((prev) => ({
      ...prev,
      [gridId]: [...(prev[gridId] || []), newChild],
    }));

    // Auto-select the newly added nested field
    setActiveEntityId(newChild.id);
  };

  // Handle deleting field from grid column
  const handleDeleteFromColumn = (gridId: string, childId: string) => {
    setGridChildren((prev) => ({
      ...prev,
      [gridId]: (prev[gridId] || []).filter((c) => c.id !== childId),
    }));

    // Clear selection if the deleted field was selected
    if (activeEntityId === childId) {
      setActiveEntityId(undefined);
    }
  };

  // Handle selecting nested field
  const handleSelectNestedField = (childId: string) => {
    setActiveEntityId(childId);
  };

  // Update nested field attribute
  const updateNestedFieldAttribute = (
    childId: string,
    attribute: string,
    value: any,
  ) => {
    setGridChildren((prev) => {
      const newChildren = { ...prev };
      for (const gridId in newChildren) {
        const childIndex = newChildren[gridId].findIndex(
          (c) => c.id === childId,
        );
        if (childIndex !== -1) {
          newChildren[gridId] = [...newChildren[gridId]];
          newChildren[gridId][childIndex] = {
            ...newChildren[gridId][childIndex],
            [attribute]: value,
          };
          break;
        }
      }
      return newChildren;
    });
  };

  // Get nested field data
  const getNestedField = (childId: string) => {
    for (const gridId in gridChildren) {
      const child = gridChildren[gridId].find((c) => c.id === childId);
      if (child) return child;
    }
    return null;
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="rounded-lg border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Demo Center Form Builder</h1>
            <p className="text-sm text-muted-foreground">
              Drag and drop to build your form
            </p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="h-auto"
          >
            <TabsList className="h-auto border p-1">
              <TabsTrigger
                value="business"
                className="px-6 py-2.5 text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Business
              </TabsTrigger>
              <TabsTrigger
                value="residential"
                className="px-6 py-2.5 text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Residential
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Save Button Row */}
      <div className="my-4 flex justify-end">
        <Button
          onClick={saveFormSchema}
          isLoading={isSaving}
          className="h-auto px-4 py-2.5"
        >
          Save Template
        </Button>
      </div>

      {/* Main Content - 4 Column Grid */}
      <div
        className={`grid flex-1 grid-cols-4 gap-6 overflow-hidden transition-all duration-300 ${
          isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Column 1: Field Types */}
        <Card className="overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-base">Field Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fieldTypes.map(({ type, label, icon: Icon }) => (
              <div
                key={type}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("fieldType", type);
                  e.dataTransfer.effectAllowed = "copy";
                  e.currentTarget.style.opacity = "0.5";
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <Button
                  variant="outline"
                  className="pointer-events-none w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Column 2-3: Form Layout (2 columns) */}
        <div
          className={`col-span-2 overflow-y-auto rounded-lg border transition-colors ${
            isDraggingOver
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            setIsDraggingOver(true);
          }}
          onDragLeave={() => {
            setIsDraggingOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            const fieldType = e.dataTransfer.getData("fieldType");
            if (fieldType) {
              let newEntityId: string;

              // Grid layout has columns and gap attributes
              if (fieldType === "gridLayout") {
                const entity = builderStore.addEntity({
                  type: fieldType as any,
                  attributes: {
                    columns: "1",
                    gap: "md",
                  },
                });
                newEntityId = entity.id;
              } else if (fieldType === "selectField") {
                // Select field needs options
                const entity = builderStore.addEntity({
                  type: fieldType as any,
                  attributes: {
                    label:
                      fieldTypes.find((f) => f.type === fieldType)?.label ||
                      "Field",
                    options: [{ label: "Option 1", value: "option1" }],
                    required: false,
                  },
                });
                newEntityId = entity.id;
              } else {
                // Other fields have label, placeholder, required
                const entity = builderStore.addEntity({
                  type: fieldType as any,
                  attributes: {
                    label:
                      fieldTypes.find((f) => f.type === fieldType)?.label ||
                      "Field",
                    required: false,
                  },
                });
                newEntityId = entity.id;
              }

              // Auto-select the newly added field
              setActiveEntityId(newEntityId);
            }
          }}
        >
          <div className="sticky top-0 z-10 border-b bg-background px-4 py-3">
            <h3 className="text-sm font-semibold">Form Layout</h3>
            <p className="text-xs text-muted-foreground">
              Click fields to edit, hover to see actions
            </p>
          </div>

          <div className="p-4">
            {Object.keys(builderStore.getSchema().entities).length === 0 ? (
              <Card className="flex min-h-[500px] items-center justify-center border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Plus className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-sm font-medium">No fields added yet</p>
                  <p className="mt-2 text-xs">
                    Drag field types from the left to start building
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                <DndContext
                  id="builder-dnd"
                  sensors={[mouseSensor]}
                  onDragEnd={handleRootDragEnd}
                >
                  <SortableContext
                    id="builder-sortable"
                    items={Array.from(root)}
                    strategy={verticalListSortingStrategy}
                  >
                    <BuilderEntities
                      builderStore={builderStore}
                      components={{
                        textField: TextFieldEntity,
                        textareaField: TextareaFieldEntity,
                        selectField: SelectFieldEntity,
                        fileField: FileFieldEntity,
                        gridLayout: GridLayoutEntity,
                      }}
                    >
                      {(props) => {
                        // Use custom wrapper for grid layout
                        if (props.entity.type === "gridLayout") {
                          return (
                            <DndItem id={props.entity.id}>
                              <Card
                                className={`group relative cursor-pointer transition-all ${
                                  props.entity.id === activeEntityId
                                    ? "border-primary shadow-sm"
                                    : "hover:border-primary/50"
                                }`}
                                onClick={() =>
                                  setActiveEntityId(props.entity.id)
                                }
                              >
                                <CardContent className="p-4">
                                  {/* Drag Handle */}
                                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 cursor-move opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="rounded bg-background p-1 shadow-md">
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 bg-background shadow-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveEntityId(props.entity.id);
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 bg-background shadow-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        // Clear active entity if it's the grid or any of its children
                                        const gridChildrenIds = (
                                          gridChildren[props.entity.id] || []
                                        ).map((c: any) => c.id);
                                        if (
                                          activeEntityId === props.entity.id ||
                                          gridChildrenIds.includes(
                                            activeEntityId,
                                          )
                                        ) {
                                          setActiveEntityId(undefined);
                                        }

                                        builderStore.deleteEntity(
                                          props.entity.id,
                                        );
                                        // Also delete children
                                        setGridChildren((prev) => {
                                          const newChildren = { ...prev };
                                          delete newChildren[props.entity.id];
                                          return newChildren;
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <GridLayoutEntityWrapper
                                    entity={props.entity}
                                    gridChildren={gridChildren}
                                    onDropInColumn={handleDropInColumn}
                                    onDeleteFromColumn={handleDeleteFromColumn}
                                    onSelectField={handleSelectNestedField}
                                  />
                                </CardContent>
                              </Card>
                            </DndItem>
                          );
                        }

                        // Regular fields
                        return (
                          <DndItem id={props.entity.id}>
                            <Card
                              className={`group relative cursor-pointer transition-all ${
                                props.entity.id === activeEntityId
                                  ? "border-primary shadow-sm"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => setActiveEntityId(props.entity.id)}
                            >
                              <CardContent className="p-4">
                                {/* Drag Handle */}
                                <div className="absolute top-1/2 -left-3 -translate-y-1/2 cursor-move opacity-0 transition-opacity group-hover:opacity-100">
                                  <div className="rounded bg-background p-1 shadow-md">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 bg-background shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveEntityId(props.entity.id);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 bg-background shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Clear active entity if it's the one being deleted
                                      if (activeEntityId === props.entity.id) {
                                        setActiveEntityId(undefined);
                                      }
                                      builderStore.deleteEntity(
                                        props.entity.id,
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                {props.children}
                              </CardContent>
                            </Card>
                          </DndItem>
                        );
                      }}
                    </BuilderEntities>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Options */}
        <Card className="overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-base">
              {activeEntityId ? "Options" : "No Field Selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeEntityId ? (
              (() => {
                // Check if this is a nested field
                const nestedField = getNestedField(activeEntityId);

                if (nestedField) {
                  // Render custom editor for nested fields
                  return (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="mb-1 block text-sm">Label</Label>
                        <Input
                          value={nestedField.label || ""}
                          onChange={(e) =>
                            updateNestedFieldAttribute(
                              activeEntityId,
                              "label",
                              e.target.value,
                            )
                          }
                          placeholder="Field label"
                        />
                      </div>

                      {nestedField.type !== "fileField" && (
                        <div className="space-y-2">
                          <Label className="mb-1 block text-sm">
                            Placeholder
                          </Label>
                          <Input
                            value={nestedField.placeholder || ""}
                            onChange={(e) =>
                              updateNestedFieldAttribute(
                                activeEntityId,
                                "placeholder",
                                e.target.value,
                              )
                            }
                            placeholder="Placeholder text"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label className="text-sm">Required Field</Label>
                        <Switch
                          checked={nestedField.required || false}
                          onCheckedChange={(checked) =>
                            updateNestedFieldAttribute(
                              activeEntityId,
                              "required",
                              checked,
                            )
                          }
                        />
                      </div>

                      {nestedField.type === "selectField" && (
                        <div className="space-y-2">
                          <Label className="mb-1 block text-sm">Options</Label>
                          <div className="space-y-2">
                            {(nestedField.options || []).map(
                              (option: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={option.label}
                                      onChange={(e) => {
                                        const newOptions = [
                                          ...(nestedField.options || []),
                                        ];
                                        newOptions[index] = {
                                          ...newOptions[index],
                                          label: e.target.value,
                                        };
                                        updateNestedFieldAttribute(
                                          activeEntityId,
                                          "options",
                                          newOptions,
                                        );
                                      }}
                                      placeholder={`Option ${index + 1}`}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="secondary"
                                      size="icon"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newOptions = (
                                          nestedField.options || []
                                        ).filter(
                                          (_: any, i: number) => i !== index,
                                        );
                                        updateNestedFieldAttribute(
                                          activeEntityId,
                                          "options",
                                          newOptions,
                                        );
                                      }}
                                      className="h-9 w-9 shrink-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={option.value}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(nestedField.options || []),
                                      ];
                                      newOptions[index] = {
                                        ...newOptions[index],
                                        value: e.target.value,
                                      };
                                      updateNestedFieldAttribute(
                                        activeEntityId,
                                        "options",
                                        newOptions,
                                      );
                                    }}
                                    placeholder={`option${index + 1}`}
                                    className="w-full"
                                  />
                                </div>
                              ),
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newIndex =
                                  (nestedField.options || []).length + 1;
                                const newOptions = [
                                  ...(nestedField.options || []),
                                  {
                                    label: `Option ${newIndex}`,
                                    value: `option${newIndex}`,
                                  },
                                ];
                                updateNestedFieldAttribute(
                                  activeEntityId,
                                  "options",
                                  newOptions,
                                );
                              }}
                              className="w-full"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular builder entity
                return (
                  <BuilderEntityAttributes
                    builderStore={builderStore}
                    components={{
                      textField: TextFieldAttributes,
                      textareaField: TextareaFieldAttributes,
                      selectField: SelectFieldAttributes,
                      fileField: FileFieldAttributes,
                      gridLayout: GridLayoutAttributes,
                    }}
                    entityId={activeEntityId}
                  />
                );
              })()
            ) : (
              <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground">
                <div>
                  <Edit className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>Select a field to edit its options</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Draggable sortable wrapper (root level)
function DndItem(props: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id: props.id });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-describedby="builder-dnd"
    >
      {props.children}
    </div>
  );
}
