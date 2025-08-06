"use client";

import { Card } from "@/components/ui/card";
import { DemoCenterFromAPI } from "@/lib/dataTypes";
import Image from "next/image";

interface DemoCentersCardsProps {
  data:
    | {
        data: DemoCenterFromAPI[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }
    | undefined;
  isLoading: boolean;
  error: Error | null;
}

const DemoCentersCards: React.FC<DemoCentersCardsProps> = ({
  data,
  isLoading,
  error,
}) => {
  const demoCenters = data?.data || [];

  // Create skeleton cards for loading state
  const SkeletonCard = () => (
    <Card className="grid animate-pulse grid-cols-1 gap-6 p-6 md:grid-cols-3">
      <div>
        <div className="mb-2 h-6 rounded bg-gray-200"></div>
        <div className="mb-4 h-4 w-32 rounded bg-gray-200"></div>
        <div className="mb-4 h-48 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-16 rounded bg-gray-200"></div>
        <div className="h-16 rounded bg-gray-200"></div>
      </div>
      <div className="space-y-3 md:col-span-2">
        <div className="h-4 w-32 rounded bg-gray-200"></div>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded bg-gray-200"></div>
          <div className="h-6 w-20 rounded bg-gray-200"></div>
          <div className="h-6 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="mb-2 h-6 w-24 rounded bg-gray-200"></div>
        <div className="mb-4 h-16 rounded bg-gray-200"></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-20 rounded bg-gray-200"></div>
          <div className="h-20 rounded bg-gray-200"></div>
        </div>
        <div className="h-16 rounded bg-gray-200"></div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {isLoading ? (
        <>
          {/* Show skeleton cards while loading */}
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </>
      ) : error ? (
        <div className="py-12 text-center">
          <div className="rounded-lg bg-red-50 p-8">
            <p className="mb-2 text-lg font-medium text-red-600">
              Error loading demo centers
            </p>
            <p className="text-sm text-red-500">
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
          </div>
        </div>
      ) : demoCenters.length === 0 ? (
        <div className="py-12 text-center">
          <div className="rounded-lg bg-gray-50 p-8">
            <div className="mb-4 text-4xl">🏋️</div>
            <p className="mb-2 text-lg font-medium text-gray-600">
              No demo centers found
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your search criteria or location filters
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Demo Centers Cards */}
          {demoCenters.map((center: DemoCenterFromAPI) => (
            <Card
              key={center.id}
              className="grid grid-cols-1 gap-6 p-6 md:grid-cols-5"
            >
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold uppercase">{center.name}</h3>
                <p className="text-sm text-muted-foreground">
                  TYPE: {center.buildingType.toUpperCase()}
                </p>
                <div className="mt-4 h-full max-h-64 w-full overflow-hidden rounded-md bg-gray-100">
                  {center.image ? (
                    <Image
                      src={center.image}
                      alt={center.name}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `
                           <div class="flex h-full w-full items-center justify-center bg-gray-200">
                             <div class="text-center text-gray-500">
                               <div class="text-2xl mb-2">🏋️</div>
                               <div class="text-sm">Gym Image</div>
                             </div>
                           </div>
                         `;
                      }}
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
                <p className="mt-1 text-muted-foreground">{center.bio}</p>
              </div>

              <div className="space-y-3 md:col-span-3">
                <p className="text-lg font-bold uppercase">Equipment Onsite</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {center.demoCenterEquipments.map((equip) => (
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
                  {center.address} <br />
                  {center.cityZip} <br />
                  {center.contact}
                </p>
                {center?.buildingType === "BUSINESS" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 rounded bg-gray-100 p-3">
                      <h4 className="text-lg font-semibold">WEEKDAYS</h4>
                      <p className="text-muted-foreground">
                        {center.weekdays.length > 0
                          ? center.weekdays.join(", ")
                          : "Not specified"}
                      </p>
                      <p className="text-lg font-semibold">
                        Opening/Closing Hour
                      </p>
                      <p className="">
                        {center.weekdayOpen && center.weekdayClose
                          ? `${center.weekdayOpen} - ${center.weekdayClose}`
                          : "Contact for hours"}
                      </p>
                    </div>
                    <div className="space-y-2 rounded bg-gray-100 p-3">
                      <h4 className="text-lg font-semibold">WEEKENDS</h4>
                      <p className="text-muted-foreground">
                        {center.weekends.length > 0
                          ? center.weekends.join(", ")
                          : "Not specified"}
                      </p>

                      <p className="text-lg font-semibold">
                        Opening/Closing Hour
                      </p>
                      <p className="">
                        {center.weekendOpen && center.weekendClose
                          ? `${center.weekendOpen} - ${center.weekendClose}`
                          : "Contact for hours"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded bg-gray-100 p-3">
                  <h4 className="text-lg font-semibold">AVAILABILITY</h4>
                  <p className="">
                    {center.availability || "Contact for availability"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default DemoCentersCards;
