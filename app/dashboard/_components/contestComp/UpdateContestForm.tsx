"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { updateContestSchema, UpdateContestFormData, ContestSectionFormData, ContestCardFormData } from "@/schema/contestSchema";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ContestCard {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  order: number;
  cardType?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContestSection {
  id: string;
  contestId: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  isVisible: boolean;
  cards: ContestCard[];
  createdAt: string;
  updatedAt: string;
}

interface Contest {
  id: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  sections: ContestSection[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateContestFormProps {
  contest: Contest;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateContestForm({ contest, onSuccess, onCancel }: UpdateContestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sections, setSections] = useState<ContestSectionFormData[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(updateContestSchema),
  });

  const isActive = watch("isActive");

  // Format date for datetime-local input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (contest) {
      reset({
        isActive: contest.isActive,
        startDate: formatDateForInput(contest.startDate) as any,
        endDate: formatDateForInput(contest.endDate) as any,
      });

      // Set sections
      const formattedSections: ContestSectionFormData[] = contest.sections.map(section => ({
        id: section.id,
        sectionType: section.sectionType,
        title: section.title || "",
        subtitle: section.subtitle || "",
        description: section.description || "",
        ctaText: section.ctaText || "",
        ctaUrl: section.ctaUrl || "",
        order: section.order,
        isVisible: section.isVisible,
        cards: section.cards.map(card => ({
          id: card.id,
          title: card.title,
          description: card.description,
          backgroundColor: card.backgroundColor,
          order: card.order,
          cardType: card.cardType || "",
        })),
      }));
      setSections(formattedSections);
    }
  }, [contest, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Validate sections before submission
      const { contestSectionSchema } = await import("@/schema/contestSchema");

      for (let i = 0; i < sections.length; i++) {
        try {
          await contestSectionSchema.validate(sections[i], { abortEarly: false });
        } catch (error: any) {
          toast.error(`Section ${i + 1}: ${error.errors?.join(', ') || 'Validation failed'}`);
          setIsSubmitting(false);
          return;
        }
      }

      const response = await fetch(`/api/contest/${contest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          sections,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating contest:", error);
      toast.error("Failed to update contest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSectionField = (sectionIndex: number, field: string, value: any) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value,
    };
    setSections(updatedSections);
  };

  const updateCardField = (sectionIndex: number, cardIndex: number, field: string, value: any) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].cards[cardIndex] = {
      ...updatedSections[sectionIndex].cards[cardIndex],
      [field]: value,
    };
    setSections(updatedSections);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Tabs defaultValue="settings" className="w-full flex flex-col h-full pb-8">
          {/* Fixed Header - Tabs */}
          <div className="flex-shrink-0 pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Contest Settings</TabsTrigger>
              <TabsTrigger value="sections">Content Sections</TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            <TabsContent value="settings" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Contest Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date & Time</Label>
                      <Input
                        id="startDate"
                        {...register("startDate")}
                        type="datetime-local"
                      />
                      <FormError message={errors.startDate?.message} />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        {...register("endDate")}
                        type="datetime-local"
                      />
                      <FormError message={errors.endDate?.message} />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <div>
                      <Label htmlFor="isActive" className="font-medium">
                        Make this contest active
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {isActive
                          ? "This contest will be visible to users and will deactivate other contests"
                          : "This contest will be saved as draft and not visible to users"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-6">
              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <Card key={section.id} className="border-l-4 border-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="capitalize">{section.sectionType.replace('_', ' ')}</span>
                        <Switch
                          checked={section.isVisible}
                          onCheckedChange={(checked) => updateSectionField(sectionIndex, 'isVisible', checked)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Section Title */}
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          value={section.title || ''}
                          onChange={(e) => updateSectionField(sectionIndex, 'title', e.target.value)}
                          placeholder="Enter section title..."
                        />
                      </div>

                      {/* Section Subtitle */}
                      <div>
                        <Label>Section Subtitle</Label>
                        <Input
                          value={section.subtitle || ''}
                          onChange={(e) => updateSectionField(sectionIndex, 'subtitle', e.target.value)}
                          placeholder="Enter section subtitle..."
                        />
                      </div>

                      {/* Section Description */}
                      <div>
                        <Label>Section Description</Label>
                        <RichTextEditor
                          content={section.description || ''}
                          onChange={(content) => updateSectionField(sectionIndex, 'description', content)}
                          placeholder="Enter section content..."
                          className="min-h-[200px]"
                        />
                      </div>

                      {/* CTA Button */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>CTA Button Text</Label>
                          <Input
                            value={section.ctaText || ''}
                            onChange={(e) => updateSectionField(sectionIndex, 'ctaText', e.target.value)}
                            placeholder="e.g., Get Started"
                          />
                        </div>
                        <div>
                          <Label>CTA Button URL</Label>
                          <Input
                            value={section.ctaUrl || ''}
                            onChange={(e) => updateSectionField(sectionIndex, 'ctaUrl', e.target.value)}
                            placeholder="e.g., /upload-video"
                          />
                        </div>
                      </div>

                      {/* Cards for sections that have them */}
                      {section.cards && section.cards.length > 0 && (
                        <div className="mt-6">
                          <Label className="text-lg font-semibold">Cards</Label>
                          <div className="space-y-4 mt-2">
                            {section.cards.map((card, cardIndex) => (
                              <Card key={card.id} className="bg-gray-50">
                                <CardContent className="p-4 space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input
                                        value={card.title}
                                        onChange={(e) => updateCardField(sectionIndex, cardIndex, 'title', e.target.value)}
                                        placeholder="Enter card title..."
                                      />
                                    </div>
                                    <div>
                                      <Label>Background Color</Label>
                                      <Input
                                        type="color"
                                        value={card.backgroundColor}
                                        onChange={(e) => updateCardField(sectionIndex, cardIndex, 'backgroundColor', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Card Description</Label>
                                    <RichTextEditor
                                      content={card.description}
                                      onChange={(content) => updateCardField(sectionIndex, cardIndex, 'description', content)}
                                      placeholder="Enter card description..."
                                      className="min-h-[150px]"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>

          {/* Fixed Footer - Buttons */}
          <div className="flex-shrink-0 flex justify-end space-x-2 pt-6 border-t bg-white mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Updating Contest..." : "Update Contest"}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}