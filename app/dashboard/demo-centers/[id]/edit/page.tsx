"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEquipments } from "@/hooks/useEquipments";
import { DemoCenter } from "@/lib/dataTypes";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building2, Home } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import BusinessDemoCenterForm, {
  businessFormSchema,
  BusinessFormValues,
} from "../../../_components/demoCenterComp/forms/BusinessDemoCenterForm";
import ResidentialDemoCenterForm, {
  residentialFormSchema,
  ResidentialFormValues,
} from "../../../_components/demoCenterComp/forms/ResidentialDemoCenterForm";

export default function EditDemoCenterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get equipments
  const { equipments, isLoading: equipmentsLoading } = useEquipments();

  // Fetch demo center data
  const { data: demoCenter, isLoading: demoCenterLoading } =
    useSWR<DemoCenter>(`/api/demo-centers/${id}`);

  // Business form
  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      buildingType: "BUSINESS",
      name: "",
      address: "",
      contact: "",
      city: "",
      state: "",
      zipCode: "",
      equipment: [],
      availability: "",
      bio: "",
      weekdays: [],
      weekends: [],
      weekdayOpen: "",
      weekdayClose: "",
      weekendOpen: "",
      weekendClose: "",
    },
  });

  // Residential form
  const residentialForm = useForm<ResidentialFormValues>({
    resolver: zodResolver(residentialFormSchema),
    defaultValues: {
      buildingType: "RESIDENTIAL",
      name: "",
      address: "",
      contact: "",
      cityZip: "",
      equipment: [],
      availability: "",
      bio: "",
    },
  });

  // Set form data when demo center loads
  useEffect(() => {
    if (demoCenter) {
      // Extract equipment IDs from demo center equipment array
      const equipmentIds =
        demoCenter.demoCenterEquipments?.map((de) => de.equipment.id) || [];

      if (demoCenter.buildingType === "BUSINESS") {
        // Split cityZip into city, state, zipCode
        // Expected format: "Los Angeles, CA 90001"
        let city = "";
        let state = "";
        let zipCode = "";

        if (demoCenter.cityZip) {
          const parts = demoCenter.cityZip.split(",").map(p => p.trim());
          if (parts.length >= 2) {
            city = parts[0];
            const stateZip = parts[1].split(" ").filter(p => p);
            if (stateZip.length >= 2) {
              state = stateZip[0];
              zipCode = stateZip[1];
            }
          }
        }

        const businessFormData = {
          buildingType: "BUSINESS" as const,
          name: demoCenter.name,
          address: demoCenter.address,
          contact: demoCenter.contact,
          city,
          state,
          zipCode,
          equipment: equipmentIds,
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
          equipment: equipmentIds,
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
    setPreview(demoCenter?.image || null);
  };

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

      // Transform separate city, state, zipCode fields into single cityZip field
      const { city, state, zipCode, ...restData } = data;
      const cityZip = `${city}, ${state} ${zipCode}`;

      // Prepare form data
      const formData = {
        ...restData,
        cityZip,
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

      // Revalidate all demo center caches
      await mutate(`/api/demo-centers/${demoCenter.id}`); // Current demo center detail
      await mutate(
        (key) => typeof key === 'string' && key.includes('/api/demo-centers/dashboard'),
        undefined,
        { revalidate: true }
      ); // All dashboard list URLs with any pagination/search

      router.push("/dashboard/demo-centers");
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

      // Revalidate all demo center caches
      await mutate(`/api/demo-centers/${demoCenter.id}`); // Current demo center detail
      await mutate(
        (key) => typeof key === 'string' && key.includes('/api/demo-centers/dashboard'),
        undefined,
        { revalidate: true }
      ); // All dashboard list URLs with any pagination/search

      router.push("/dashboard/demo-centers");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update demo center",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (demoCenterLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          <p className="mt-4 text-muted-foreground">Loading demo center...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!demoCenter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Demo Center Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The demo center you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/dashboard/demo-centers">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demo Centers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isBusiness = demoCenter.buildingType === "BUSINESS";

  return (
    <div className="container mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/demo-centers">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demo Centers
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Demo Center</h1>
            <p className="mt-2 text-muted-foreground">
              Update the information for this demo center
            </p>
          </div>
          <Badge
            variant={isBusiness ? "default" : "secondary"}
            className="flex items-center gap-2 px-4 py-2 text-sm"
          >
            {isBusiness ? (
              <>
                <Building2 className="h-4 w-4" />
                Business
              </>
            ) : (
              <>
                <Home className="h-4 w-4" />
                Residential
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        {isBusiness ? (
          <BusinessDemoCenterForm
            form={businessForm}
            equipments={equipments}
            isLoading={equipmentsLoading}
            preview={preview}
            onSubmit={onBusinessSubmit}
            isSubmitting={isSubmitting}
            handleFileChange={handleFileChange}
            removeImage={removeImage}
          />
        ) : (
          <ResidentialDemoCenterForm
            form={residentialForm}
            equipments={equipments}
            isLoading={equipmentsLoading}
            preview={preview}
            onSubmit={onResidentialSubmit}
            isSubmitting={isSubmitting}
            handleFileChange={handleFileChange}
            removeImage={removeImage}
          />
        )}
      </div>
    </div>
  );
}
