"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const businessFormSchema = z.object({
  buildingType: z.literal("BUSINESS"),
  name: z.string().min(1, "Business name is required"),
  address: z.string().optional().or(z.literal("")),
  contact: z.string().min(1, "Contact information is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  equipment: z
    .array(z.string())
    .min(1, "At least one equipment must be selected"),
  availability: z.string().min(1, "Availability is required"),
  bio: z.string().min(1, "Bio is required"),
  weekdays: z.array(z.string()).optional(),
  weekends: z.array(z.string()).optional(),
  weekdayOpen: z.string().optional(),
  weekdayClose: z.string().optional(),
  weekendOpen: z.string().optional(),
  weekendClose: z.string().optional(),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

interface BusinessFormProps {
  onSubmit: (data: BusinessFormValues) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  form: UseFormReturn<BusinessFormValues>;
  equipment: { id: string; name: string }[];
  isLoading: boolean;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  generateTimeOptions: () => React.ReactNode[];
}

export default function BusinessForm({
  onSubmit,
  isSubmitting,
  form,
  equipment,
  isLoading,
  preview,
  handleFileChange,
  removeImage,
  generateTimeOptions,
}: BusinessFormProps) {
  // render the form
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
                Business Name *
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter business name" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Please enter the name of your business
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
                ✕
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Please upload a photo of the outside of your business
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
                  options={equipment.map((equipment) => ({
                    label: equipment.name,
                    value: equipment.id,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder={
                    isLoading ? "Loading equipment..." : "Select Equipment"
                  }
                  disabled={isLoading || equipment.length === 0}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Select the equipment you have available at your demo center
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6 pt-6">
          <h2 className="text-lg font-semibold">Business Availability</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Weekdays Checkboxes */}
            <FormItem>
              <FormLabel className="text-md mb-2 font-semibold">
                Weekdays
              </FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                  (day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <Checkbox
                        onCheckedChange={(checked) => {
                          const current = form.getValues("weekdays") || [];
                          if (checked) {
                            form.setValue("weekdays", [...current, day]);
                          } else {
                            form.setValue(
                              "weekdays",
                              current.filter((d: string) => d !== day),
                            );
                          }
                        }}
                        checked={form.watch("weekdays")?.includes(day)}
                      />
                      <span>{day}</span>
                    </label>
                  ),
                )}
              </div>
            </FormItem>

            {/* Weekends Checkboxes */}
            <FormItem>
              <FormLabel className="text-md mb-2 font-semibold">
                Weekends
              </FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {["Saturday", "Sunday"].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <Checkbox
                      onCheckedChange={(checked) => {
                        const current = form.getValues("weekends") || [];
                        if (checked) {
                          form.setValue("weekends", [...current, day]);
                        } else {
                          form.setValue(
                            "weekends",
                            current.filter((d: string) => d !== day),
                          );
                        }
                      }}
                      checked={form.watch("weekends")?.includes(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </FormItem>
          </div>

          {/* Weekdays Opening/Closing Time */}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="weekdayOpen"
              render={({ field }) => (
                <FormItem className="max-h-[50px]">
                  <FormLabel className="text-md font-semibold">
                    Weekdays Opening Time
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) =>
                        [0, 15, 30, 45].map((min) => {
                          const display = `${((hour + 11) % 12) + 1}:${min === 0 ? "00" : min.toString().padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
                          return (
                            <SelectItem key={display} value={display}>
                              {display}
                            </SelectItem>
                          );
                        }),
                      ).flat()}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weekdayClose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">
                    Weekdays Closing Time
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) =>
                        [0, 15, 30, 45].map((min) => {
                          const display = `${((hour + 11) % 12) + 1}:${min === 0 ? "00" : min.toString().padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
                          return (
                            <SelectItem key={display} value={display}>
                              {display}
                            </SelectItem>
                          );
                        }),
                      ).flat()}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Weekends Opening/Closing Time */}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="weekendOpen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">
                    Weekends Opening Time
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) =>
                        [0, 15, 30, 45].map((min) => {
                          const display = `${((hour + 11) % 12) + 1}:${min === 0 ? "00" : min.toString().padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
                          return (
                            <SelectItem key={display} value={display}>
                              {display}
                            </SelectItem>
                          );
                        }),
                      ).flat()}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weekendClose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">
                    Weekends Closing Time
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) =>
                        [0, 15, 30, 45].map((min) => {
                          const display = `${((hour + 11) % 12) + 1}:${min === 0 ? "00" : min.toString().padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
                          return (
                            <SelectItem key={display} value={display}>
                              {display}
                            </SelectItem>
                          );
                        }),
                      ).flat()}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">
                Additional Availability Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  {...field}
                  placeholder="Any additional availability information..."
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                <p>
                  Use this field to provide additional availability details if
                  the weekday and weekend hours above don&apos;t fit your needs.
                </p>
                <p className="mt-4">
                  Example: Available Monday-Wednesday 1:00pm - 5:00pm, Friday
                  10:00am - 12:00pm, Saturday 3:00pm - 5:00pm.
                </p>
                <p className="mt-4">
                  You can leave all hours and availability fields blank and the
                  site will say &quot;Contact for availability&quot;
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
              <FormLabel className="text-md font-semibold">
                Business Bio *
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  {...field}
                  placeholder="Tell us about your business..."
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Tell everyone a little bit about your business and what makes it
                special
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
          {isSubmitting ? "Submitting..." : "Submit Business Demo Center"}
        </Button>
      </form>
    </Form>
  );
}
