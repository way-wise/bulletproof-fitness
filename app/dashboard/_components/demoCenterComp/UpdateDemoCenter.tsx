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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useEquipments } from "@/hooks/useEquipments";
import { DemoCenter } from "@/lib/dataTypes";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Home, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Business Form Schema
const businessFormSchema = z.object({
  buildingType: z.literal("BUSINESS"),
  name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact information is required"),
  cityZip: z.string().min(1, "City/Zip is required"),
  equipment: z.string().min(1, "Equipment selection is required"),
  availability: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
  weekdays: z.array(z.string()).optional(),
  weekends: z.array(z.string()).optional(),
  weekdayOpen: z.string().optional(),
  weekdayClose: z.string().optional(),
  weekendOpen: z.string().optional(),
  weekendClose: z.string().optional(),
});

// Residential Form Schema
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

type BusinessFormValues = z.infer<typeof businessFormSchema>;
type ResidentialFormValues = z.infer<typeof residentialFormSchema>;

interface UpdateDemoCenterProps {
  isOpen: boolean;
  onClose: () => void;
  demoCenter: DemoCenter | null;
  onUpdate: () => void;
}

export default function UpdateDemoCenter({
  isOpen,
  onClose,
  demoCenter,
  onUpdate,
}: UpdateDemoCenterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"business" | "residential">(
    "business",
  );

  // Get equipments
  const { equipments, isLoading } = useEquipments();

  // Business form
  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      buildingType: "BUSINESS",
      weekdays: [],
      weekends: [],
    },
  });

  // Residential form
  const residentialForm = useForm<ResidentialFormValues>({
    resolver: zodResolver(residentialFormSchema),
    defaultValues: {
      buildingType: "RESIDENTIAL",
    },
  });

  // Set form data when demo center changes
  useEffect(() => {
    if (demoCenter) {
      const isBusiness = demoCenter.buildingType === "BUSINESS";
      setActiveTab(isBusiness ? "business" : "residential");

      if (isBusiness) {
        const businessFormData = {
          buildingType: "BUSINESS" as const,
          name: demoCenter.name,
          address: demoCenter.address,
          contact: demoCenter.contact,
          cityZip: demoCenter.cityZip,
          equipment: demoCenter.demoCenterEquipments?.[0]?.equipment.name || "",
          availability: demoCenter.availability || "",
          bio: demoCenter.bio,
          weekdays: demoCenter.weekdays || [],
          weekends: demoCenter.weekends || [],
          weekdayOpen: demoCenter.weekdayOpen || "",
          weekdayClose: demoCenter.weekdayClose || "",
          weekendOpen: demoCenter.weekendOpen || "",
          weekendClose: demoCenter.weekendClose || "",
        };
        businessForm.reset(businessFormData);
      } else {
        const residentialFormData = {
          buildingType: "RESIDENTIAL" as const,
          name: demoCenter.name,
          address: demoCenter.address,
          contact: demoCenter.contact,
          cityZip: demoCenter.cityZip,
          equipment: demoCenter.demoCenterEquipments?.[0]?.equipment.name || "",
          availability: demoCenter.availability || "",
          bio: demoCenter.bio,
        };
        residentialForm.reset(residentialFormData);
      }

      setPreview(demoCenter.image);
    }
  }, [demoCenter, businessForm, residentialForm]);

  // Handle file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove image from preview
  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  // Generate time options for opening/closing times
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

  // Handle business form submission
  const onBusinessSubmit = async (data: BusinessFormValues) => {
    if (!demoCenter) return;

    setIsSubmitting(true);
    try {
      let imageUrl = demoCenter.image;

      // Upload new image if file is selected
      if (file) {
        const uploadedImageUrl = await uploadImageToImgBB(file);
        if (!uploadedImageUrl) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = uploadedImageUrl;
      }

      // Prepare form data
      const formData = {
        ...data,
        image: imageUrl,
      };

      // Submit to API
      const response = await fetch(`/api/demo-centers/${demoCenter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update demo center");
      }

      toast.success("Demo center updated successfully!");
      onUpdate();
      onClose();
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update demo center",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle residential form submission
  const onResidentialSubmit = async (data: ResidentialFormValues) => {
    if (!demoCenter) return;

    setIsSubmitting(true);
    try {
      let imageUrl = demoCenter.image;

      // Upload new image if file is selected
      if (file) {
        const uploadedImageUrl = await uploadImageToImgBB(file);
        if (!uploadedImageUrl) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = uploadedImageUrl;
      }

      // Prepare form data
      const formData = {
        ...data,
        image: imageUrl,
      };

      // Submit to API
      const response = await fetch(`/api/demo-centers/${demoCenter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update demo center");
      }

      toast.success("Demo center updated successfully!");
      onUpdate();
      onClose();
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update demo center",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!demoCenter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Demo Center
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "business" | "residential")
            }
            className="w-full"
          >
            <TabsList className="mx-auto mb-8 flex w-fit gap-4 rounded-lg border bg-gray-50 p-1 shadow-sm">
              <TabsTrigger
                value="business"
                className="rounded-md px-6 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger
                value="residential"
                className="rounded-md px-6 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Residential
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-0">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Update Business Demo Center
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Update your business demo center information
                  </p>
                </div>
                <BusinessForm
                  form={businessForm}
                  equipments={equipments}
                  isLoading={isLoading}
                  preview={preview}
                  setPreview={setPreview}
                  onSubmit={onBusinessSubmit}
                  isSubmitting={isSubmitting}
                  file={file}
                  setFile={setFile}
                  handleFileChange={handleFileChange}
                  removeImage={removeImage}
                  generateTimeOptions={generateTimeOptions}
                />
              </div>
            </TabsContent>

            <TabsContent value="residential" className="mt-0">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Update Residential Demo Center
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Update your residential demo center information
                  </p>
                </div>
                <ResidentialForm
                  form={residentialForm}
                  equipments={equipments}
                  isLoading={isLoading}
                  preview={preview}
                  setPreview={setPreview}
                  onSubmit={onResidentialSubmit}
                  isSubmitting={isSubmitting}
                  file={file}
                  setFile={setFile}
                  handleFileChange={handleFileChange}
                  removeImage={removeImage}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Business Form Component
interface BusinessFormProps {
  form: ReturnType<typeof useForm<BusinessFormValues>>;
  equipments: { id: string; name: string }[];
  isLoading: boolean;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  onSubmit: (data: BusinessFormValues) => void;
  isSubmitting: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  generateTimeOptions: () => React.ReactNode[];
}

function BusinessForm({
  form,
  equipments,
  isLoading,
  preview,
  onSubmit,
  isSubmitting,
  handleFileChange,
  removeImage,
  generateTimeOptions,
}: BusinessFormProps) {
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
                <X className="h-3 w-3" />
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
                      <option value="">Select time</option>
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
                      <option value="">Select time</option>
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
                      <option value="">Select time</option>
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
                      <option value="">Select time</option>
                      {generateTimeOptions()}
                    </select>
                  </FormControl>
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
          {isSubmitting ? "Updating..." : "Update Business Demo Center"}
        </Button>
      </form>
    </Form>
  );
}

// Residential Form Component
interface ResidentialFormProps {
  form: ReturnType<typeof useForm<ResidentialFormValues>>;
  equipments: { id: string; name: string }[];
  isLoading: boolean;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  onSubmit: (data: ResidentialFormValues) => void;
  isSubmitting: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

function ResidentialForm({
  form,
  equipments,
  isLoading,
  preview,
  onSubmit,
  isSubmitting,
  handleFileChange,
  removeImage,
}: ResidentialFormProps) {
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
          {isSubmitting ? "Updating..." : "Update Residential Demo Center"}
        </Button>
      </form>
    </Form>
  );
}
