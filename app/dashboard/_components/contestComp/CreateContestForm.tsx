"use client";

import { useState } from "react";
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
import { contestSchema, ContestFormData, PrizeCardFormData } from "@/schema/contestSchema";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import PrizeCardManager from "./PrizeCardManager";

interface CreateContestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateContestForm({ onSuccess, onCancel }: CreateContestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rich text content
  const [content, setContent] = useState("");
  const [rules, setRules] = useState("");
  const [prizeCards, setPrizeCards] = useState<PrizeCardFormData[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(contestSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          content,
          rules,
          prizeCards,
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
      console.error("Error creating contest:", error);
      toast.error("Failed to create contest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Contest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Contest Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g., Summer Fitness Challenge 2024"
                    className="text-lg"
                  />
                  <FormError message={errors.title?.message} />
                </div>

                {/* Subtitle */}
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    {...register("subtitle")}
                    placeholder="e.g., Show Your Strength, Win Amazing Prizes!"
                  />
                  <FormError message={errors.subtitle?.message} />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Brief description that will appear in previews and summaries"
                    rows={3}
                  />
                  <FormError message={errors.description?.message} />
                </div>

                {/* Banner Image */}
                <div>
                  <Label htmlFor="bannerImage">Banner Image URL</Label>
                  <Input
                    id="bannerImage"
                    {...register("bannerImage")}
                    placeholder="https://example.com/banner-image.jpg"
                    type="url"
                  />
                  <FormError message={errors.bannerImage?.message} />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended size: 1200x600px for best display
                  </p>
                </div>

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

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contest Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Write the main content for your contest that will appear in the Details tab.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Label htmlFor="content">Contest Content</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Enter the main contest details, what it's about, how to participate, etc..."
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contest Rules</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Write the rules and guidelines for your contest that will appear in the Rules tab.
                </p>
              </CardHeader>
              <CardContent>
                <Label htmlFor="rules">Contest Rules</Label>
                <RichTextEditor
                  content={rules}
                  onChange={setRules}
                  placeholder="Enter the contest rules, eligibility requirements, submission guidelines, etc..."
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prizes & Rewards</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create individual prize cards with titles and descriptions. Each card will be displayed with its own styling.
                </p>
              </CardHeader>
              <CardContent>
                <PrizeCardManager
                  prizeCards={prizeCards}
                  onChange={setPrizeCards}
                />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Creating Contest..." : "Create Contest"}
          </Button>
        </div>
      </form>
    </div>
  );
}
