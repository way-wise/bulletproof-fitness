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
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const residentialFormSchema = z.object({
  buildingType: z.literal("RESIDENTIAL"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional().or(z.literal("")),
  contact: z.string().min(1, "Contact information is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  equipment: z
    .array(z.string())
    .min(1, "At least one equipment must be selected"),
  availability: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
});

export type ResidentialFormValues = z.infer<typeof residentialFormSchema>;

interface ResidentialDemoCenterFormProps {
  form: UseFormReturn<ResidentialFormValues>;
  equipments: { id: string; name: string }[];
  isLoading: boolean;
  preview: string | null;
  onSubmit: (data: ResidentialFormValues) => void;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export default function ResidentialDemoCenterForm({
  form,
  equipments,
  isLoading,
  preview,
  onSubmit,
  isSubmitting,
  handleFileChange,
  removeImage,
}: ResidentialDemoCenterFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
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
              <FormItem className="md:col-span-3">
                <FormLabel className="text-md font-semibold">
                  Street Address
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
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-md font-semibold">City *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Los Angeles" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-md font-semibold">State *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CA" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-md font-semibold">
                  Zip Code *
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="99999" />
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
                <X className="h-3 w-3" />
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
              <FormControl>
                <MultiSelect
                  options={equipments.map((equipment) => ({
                    label: equipment.name,
                    value: equipment.id,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder={
                    isLoading ? "Loading equipment..." : "Select Equipment"
                  }
                  disabled={isLoading || equipments.length === 0}
                  className="w-full"
                />
              </FormControl>
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
          {isSubmitting ? "Updating..." : "Update Residential Demo Center"}
        </Button>
      </form>
    </Form>
  );
}
