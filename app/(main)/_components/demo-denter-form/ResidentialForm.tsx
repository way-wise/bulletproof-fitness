"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEquipments } from "@/hooks/useEquipments";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const residentialFormSchema = z.object({
  buildingType: z.literal("RESIDENTIAL"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact information is required"),
  cityZip: z.string().min(1, "City/Zip is required"),
  equipment: z.string().min(1, "Equipment selection is required"),
  availability: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
});

type ResidentialFormValues = z.infer<typeof residentialFormSchema>;

export default function ResidentialForm() {
  const { equipments, isLoading } = useEquipments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const form = useForm<ResidentialFormValues>({
    resolver: zodResolver(residentialFormSchema),
    defaultValues: {
      buildingType: "RESIDENTIAL",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: ResidentialFormValues) => {
    if (!file) {
      toast.error("Please upload a facility photo");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image
      const imageUrl = await uploadImageToImgBB(file);
      if (!imageUrl) {
        toast.error("Failed to upload image");
        return;
      }

      // Prepare form data
      const formData = {
        ...data,
        image: imageUrl,
      };

      // Submit to API
      const response = await fetch("/api/demo-centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      toast.success("Residential demo center submitted successfully!");
      form.reset();
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit form",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-6xl space-y-6 rounded-lg p-0 md:p-6"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Full Name *
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Please enter your full name
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  Phone or Email *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="555-111-2222 or name@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  Street Address *
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Main St." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cityZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  City, State, Zip Code *
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Los Angeles, CA 99999" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel className="text-md font-semibold">
            Facility Photo *
          </FormLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded border p-2"
          />
          {preview && (
            <div className="relative mt-4 h-48 w-48">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded-md border object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 rounded-full bg-red-500 p-1 text-white"
              >
                ✕
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            You can upload a photo of the outside of your residence, a photo of
            your home gym, or a photo of yourself
          </p>
        </FormItem>

        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">
                Equipment Available *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading equipment...
                    </SelectItem>
                  ) : equipments.length === 0 ? (
                    <SelectItem value="no-equipment" disabled>
                      No equipment available
                    </SelectItem>
                  ) : (
                    equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.name}>
                        {equipment.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the equipment you have available at your demo center
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">
                Availability
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  {...field}
                  placeholder="Describe your availability..."
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                <p>
                  Use this field to outline your availability for demo sessions.
                </p>
                <p className="mt-4">
                  Example: Available Monday-Wednesday 1:00pm - 5:00pm, Friday
                  10:00am - 12:00pm, Saturday 3:00pm - 5:00pm.
                </p>
                <p className="mt-4">
                  You can leave this field blank and the site will say
                  &quot;Contact for availability&quot;
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">Bio *</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  {...field}
                  placeholder="Tell us about yourself..."
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Tell everyone a little bit about yourself and your fitness
                journey
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Residential Demo Center"}
        </Button>
      </form>
    </Form>
  );
}
