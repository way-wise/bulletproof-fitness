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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEquipments } from "@/hooks/useEquipments";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  buildingType: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  contact: z.string().min(1),
  cityZip: z.string().min(1),
  photo: z.any(),
  equipment: z.string().min(1),
  availability: z.string().optional(),
  bio: z.string().min(1),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions.",
  }),
  weekdays: z.array(z.string()).optional(),
  weekends: z.array(z.string()).optional(),
  weekdayOpen: z.string().optional(),
  weekdayClose: z.string().optional(),
  weekendOpen: z.string().optional(),
  weekendClose: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResidentialForm() {
  const { equipments, isLoading } = useEquipments();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingType: "RESIDENTIAL",
    },
  });
  const buildingType = form.watch("buildingType");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, photo: file });
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
  function generateTimeOptions() {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const min of [0, 30]) {
        const display = `${((hour + 11) % 12) + 1}:${min === 0 ? "00" : "30"} ${hour < 12 ? "AM" : "PM"}`;
        times.push(
          <option key={display} value={display}>
            {display}
          </option>,
        );
      }
    }
    return times;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl space-y-6 rounded-lg border p-6 shadow"
        autoComplete="off"
      >
        <h1 className="text-center text-2xl font-bold">Demo Center Form</h1>

        <FormField
          control={form.control}
          name="buildingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Building/Type of Facility *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-x-4"
                >
                  <div className="flex items-center space-x-2 text-lg font-semibold">
                    <RadioGroupItem
                      value="RESIDENTIAL"
                      id="residential"
                      className="h-6 w-6 rounded-full border-gray-300 data-[state=checked]:border-blue-800"
                    />

                    <label htmlFor="residential">Residential</label>
                  </div>
                  <div className="flex items-center space-x-2 text-lg font-semibold">
                    <RadioGroupItem
                      value="BUSINESS"
                      id="business"
                      className="h-6 w-6 rounded-full border-gray-300 data-[state=checked]:border-blue-800"
                    />

                    <label htmlFor="business">Business</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                {buildingType === "BUSINESS"
                  ? "Business or Contact Name "
                  : "Name"}{" "}
                *
              </FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                {buildingType === "BUSINESS"
                  ? "Please enter the name of the business if this is a commercial building or enter the contact name of the person if this is a residence."
                  : "Please enter your full name"}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Example: 123 Main St.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  Phone or Email *
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Example: 555-111-2222 or name@gmail.com
                </p>
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
                  <Input {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Example: Los Angeles, CA 99999
                </p>
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
            Please upload a photo of the outside of the business if this is a
            business. If this is for a residence, you can upload a photo of the
            outside of your residence, a photo of your home gym, or a photo of
            the contact person.
          </p>
        </FormItem>

        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">
                List of Equipment *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.name}>
                      {equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Please check the box next to any item of equipment you have
                available at your demo center.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {buildingType === "BUSINESS" && (
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
                  <FormItem>
                    <FormLabel className="text-md font-semibold">
                      Weekdays Opening Time
                    </FormLabel>
                    <FormControl>
                      <select {...field} className="w-full rounded border p-2">
                        {generateTimeOptions()}
                      </select>
                    </FormControl>
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
                    <FormControl>
                      <select {...field} className="w-full rounded border p-2">
                        {generateTimeOptions()}
                      </select>
                    </FormControl>
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
                    <FormControl>
                      <select {...field} className="w-full rounded border p-2">
                        {generateTimeOptions()}
                      </select>
                    </FormControl>
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
                    <FormControl>
                      <select {...field} className="w-full rounded border p-2">
                        {generateTimeOptions()}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md font-semibold">
                Availability
              </FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                <p>
                  Use this field to outline your availability. Use this field to
                  outline your availability. This field can be used for
                  businesses if the weekday and weekend hours listed on the form
                  for you do not fit your needs, or if you are a residence and
                  want to provide more details.
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
              <FormLabel className="text-md font-semibold">Bio *</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Tell everyone a little bit about yourself if you would like to
                share 😊
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-start space-x-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm leading-none">
                  I accept Terms & Conditions.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full cursor-pointer">
          Submit
        </Button>
      </form>
    </Form>
  );
}
