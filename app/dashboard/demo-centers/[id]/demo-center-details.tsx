"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface DemoCenterDetailsProps {
  id: string;
}

export const DemoCenterDetails = ({ id }: DemoCenterDetailsProps) => {
  const { data: demoCenter, isValidating } = useSWR(`/api/demo-centers/${id}`);
  const router = useRouter();

  if (isValidating) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Demo Centers
      </Button>
      <Card className="grid grid-cols-1 gap-6 p-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold uppercase">{demoCenter?.name}</h3>
          <p className="text-sm text-muted-foreground">
            TYPE: {demoCenter?.buildingType.toUpperCase()}
          </p>
          <div className="mt-4 h-64 w-full overflow-hidden rounded-md bg-gray-100">
            {demoCenter?.image ? (
              <Image
                src={demoCenter.image}
                alt={demoCenter.name}
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <div className="mb-2 text-2xl">🏋️</div>
                  <div className="text-sm">No Image Available</div>
                </div>
              </div>
            )}
          </div>
          <p className="pt-2 text-lg font-semibold">BIO:</p>
          <p className="mt-1 text-muted-foreground">{demoCenter?.bio}</p>
        </div>

        <div className="space-y-3 md:col-span-3">
          <p className="text-2xl font-bold uppercase">Equipment Onsite</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {demoCenter?.demoCenterEquipments.map((equip: any) => (
              <span
                key={equip.id}
                className="inline-block rounded bg-gray-300 px-2 py-1 text-sm text-primary"
              >
                {equip.equipment.name}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-bold text-blue-900">VISIT US</h2>
          <p className="leading-5 text-gray-500">
            {demoCenter?.address} <br />
            {demoCenter?.cityZip} <br />
            {demoCenter?.contact}
          </p>
          {demoCenter?.buildingType === "BUSINESS" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded bg-gray-100 p-3">
                <h4 className="text-lg font-semibold">WEEKDAYS</h4>
                <p className="text-muted-foreground">
                  {demoCenter?.weekdays.length > 0
                    ? demoCenter.weekdays.join(", ")
                    : "Not specified"}
                </p>
                <p className="text-lg font-semibold">Opening/Closing Hour</p>
                <p className="">
                  {demoCenter?.weekdayOpen && demoCenter?.weekdayClose
                    ? `${demoCenter.weekdayOpen} - ${demoCenter.weekdayClose}`
                    : "Contact for hours"}
                </p>
              </div>
              <div className="space-y-2 rounded bg-gray-100 p-3">
                <h4 className="text-lg font-semibold">WEEKENDS</h4>
                <p className="text-muted-foreground">
                  {demoCenter?.weekends.length > 0
                    ? demoCenter.weekends.join(", ")
                    : "Not specified"}
                </p>

                <p className="text-lg font-semibold">Opening/Closing Hour</p>
                <p className="">
                  {demoCenter?.weekendOpen && demoCenter?.weekendClose
                    ? `${demoCenter.weekendOpen} - ${demoCenter.weekendClose}`
                    : "Contact for hours"}
                </p>
              </div>
            </div>
          )}

          <div className="rounded bg-gray-100 p-3">
            <h4 className="text-lg font-semibold">AVAILABILITY</h4>
            <p className="">
              {demoCenter?.availability || "Contact for availability"}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
