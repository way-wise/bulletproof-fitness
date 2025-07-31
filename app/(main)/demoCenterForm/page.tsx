// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Building2, Home } from "lucide-react";
// import { useState } from "react";
// import BusinessForm from "../_components/demo-denter-form/BusinessForm";
// import ResidentialForm from "../_components/demo-denter-form/ResidentialForm";

// export default function DemoCenterFormPage() {
//   const [selectedType, setSelectedType] = useState<
//     "business" | "residential" | null
//   >(null);

//   if (selectedType === "business") {
//     return <BusinessForm />;
//   }

//   if (selectedType === "residential") {
//     return <ResidentialForm />;
//   }

//   return (
//     <div className="container mx-auto max-w-4xl p-6">
//       <div className="mb-8 text-center">
//         <h1 className="mb-4 text-3xl font-bold">Demo Center Registration</h1>
//         <p className="text-lg text-muted-foreground">
//           Choose the type of demo center you want to register
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Business Card */}
//         <Card
//           className="cursor-pointer transition-all hover:shadow-lg"
//           onClick={() => setSelectedType("business")}
//         >
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
//               <Building2 className="h-8 w-8 text-blue-600" />
//             </div>
//             <CardTitle className="text-xl">Business Demo Center</CardTitle>
//             <CardDescription>
//               Register your business as a demo center for fitness equipment
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>• Perfect for gyms, fitness centers, and health clubs</li>
//               <li>• Set business hours and availability</li>
//               <li>• Professional facility showcase</li>
//               <li>• Multiple equipment options</li>
//             </ul>
//             <Button
//               className="mt-4 w-full"
//               onClick={() => setSelectedType("business")}
//             >
//               Register Business
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Residential Card */}
//         <Card
//           className="cursor-pointer transition-all hover:shadow-lg"
//           onClick={() => setSelectedType("residential")}
//         >
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//               <Home className="h-8 w-8 text-green-600" />
//             </div>
//             <CardTitle className="text-xl">Residential Demo Center</CardTitle>
//             <CardDescription>
//               Register your home as a demo center for fitness equipment
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>• Perfect for home gyms and personal trainers</li>
//               <li>• Flexible availability scheduling</li>
//               <li>• Personal fitness space showcase</li>
//               <li>• Individual equipment demonstrations</li>
//             </ul>
//             <Button
//               className="mt-4 w-full"
//               onClick={() => setSelectedType("residential")}
//             >
//               Register Residential
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="mt-8 text-center">
//         <p className="text-sm text-muted-foreground">
//           Both types of demo centers will be listed on our platform for
//           customers to find and book sessions.
//         </p>
//       </div>
//     </div>
//   );
// }
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
        <h1 className="mb-4 text-3xl font-bold">Demo Center Registration</h1>
        <p className="text-lg text-muted-foreground">
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Building2 className="h-8 w-8 text-black" />
              </div>
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Home className="h-8 w-8 text-black" />
              </div>
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
