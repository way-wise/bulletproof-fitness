
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Home } from "lucide-react";
import BusinessForm from "../_components/demo-denter-form/BusinessForm";
import ResidentialForm from "../_components/demo-denter-form/ResidentialForm";

export default function DemoCenterFormPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-2xl font-bold md:text-3xl">
          Demo Center Registration
        </h1>
        <p className="text-md text-muted-foreground md:text-lg">
          Select a demo center type and complete your registration
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="mx-auto flex w-fit gap-4 rounded-lg border bg-white p-1 shadow-sm">
          <TabsTrigger
            value="business"
            className="rounded-md px-5 py-2 text-lg font-medium data-[state=active]:bg-black data-[state=active]:text-white"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger
            value="residential"
            className="rounded-md px-5 py-2 text-lg font-medium data-[state=active]:bg-black data-[state=active]:text-white"
          >
            <Home className="mr-2 h-4 w-4" />
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
              <BusinessForm />
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
              <ResidentialForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
