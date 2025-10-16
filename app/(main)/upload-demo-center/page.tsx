"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEquipments } from "@/hooks/useEquipments";
import { uploadImageToImgBB } from "@/lib/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Home } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BusinessForm, {
  businessFormSchema,
  BusinessFormValues,
} from "../_components/demo-denter-form/BusinessForm";
import ResidentialForm from "../_components/demo-denter-form/ResidentialForm";

export default function DemoCenterFormPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementWidgetId, setAgreementWidgetId] = useState<string | null>(
    null,
  );

  // get equipments
  const { equipments, isLoading } = useEquipments();

  // zod resolver
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      buildingType: "BUSINESS",
      weekdays: [],
      weekends: [],
    },
  });

  // handle file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // remove image from preview
  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  // generate time options for opening/closing times
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

  // handle form submission
  const onSubmit = async (data: BusinessFormValues) => {
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

      // Transform separate city, state, zipCode fields into single cityZip field
      const { city, state, zipCode, ...restData } = data;
      const cityZip = `${city}, ${state} ${zipCode}`;

      // Prepare form data with required fields
      const formData = {
        ...restData,
        cityZip,
        image: imageUrl,
        // Add required fields with default values for API
        isPublic: false,
        blocked: false,
        blockReason: "Not blocked",
      };

      //  Submit to API
      const response = await fetch("/api/demo-centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = "Failed to submit form";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.message ||
            errorData.validationError?.message ||
            "Failed to submit form";
        } catch (e) {
          errorMessage = responseText || "Failed to submit form";
        }
        throw new Error(errorMessage);
      }

      setAgreementWidgetId(
        "CBFCIBAA3AAABLblqZhAOZCgwKvj8DKEzXVqmWXBtuqCzZpn6UpUGIiMutxmtR3A8oUMhEkiV1qWXbmz3pIU",
      );
      setShowAgreement(true);
      // setSubmittedFormData(formData);

      toast.success("Business demo center submitted successfully!");
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

  // render the agreement pdf
  if (showAgreement && agreementWidgetId) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Complete Your Agreement
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Please complete the below terms and conditions to be part of our
            Demo Center network.
          </p>
        </div>

        <div className="relative">
          <iframe
            style={{
              border: 0,
              overflow: "hidden",
              minHeight: "600px",
              minWidth: "100%",
            }}
            src={`https://na2.documents.adobe.com/public/esignWidget?wid=${agreementWidgetId}&hosted=false`}
            width="100%"
            height="600"
            title="Adobe Sign Agreement"
            className="rounded-lg"
          />
        </div>
      </div>
    );
  }

  // render the form
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">
          Demo Center Registration
        </h1>
        <p className="text-md text-muted-foreground md:text-lg">
          Select a demo center type and complete your registration
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="mx-auto flex w-fit gap-4 rounded-lg border bg-white px-1 py-5 shadow-sm">
          <TabsTrigger
            value="business"
            className="rounded-md p-4 text-lg font-medium data-[state=active]:bg-black data-[state=active]:text-white"
          >
            <Building2 className="size-4" />
            Business
          </TabsTrigger>
          <TabsTrigger
            value="residential"
            className="rounded-md p-4 text-lg font-medium data-[state=active]:bg-black data-[state=active]:text-white"
          >
            <Home className="size-4" />
            Residential
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Business Demo Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BusinessForm
                form={form}
                equipment={equipments}
                isLoading={isLoading}
                preview={preview}
                setPreview={setPreview}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                file={file}
                setFile={setFile}
                handleFileChange={handleFileChange}
                removeImage={removeImage}
                generateTimeOptions={generateTimeOptions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="residential" className="mt-6">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Residential Demo Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResidentialForm
                setShowAgreement={setShowAgreement}
                setAgreementWidgetId={setAgreementWidgetId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
