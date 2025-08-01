"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipments } from "@/hooks/useEquipments";
import { DemoCenterFromAPI } from "@/lib/dataTypes";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const DemoCentersCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("5");
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { equipments } = useEquipments();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch demo centers using SWR with pagination and search
  const url = `/api/demo-centers?page=${pagination.pageIndex}&limit=${pagination.pageSize}&search=${encodeURIComponent(searchTerm)}`;
  const { data, error, isValidating } = useSWR(url, async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch demo centers");
    }
    return response.json();
  });

  // Filter demo centers based on search and filters
  const filteredDemoCenters = useMemo(() => {
    const demoCenters = data?.data || [];

    return demoCenters.filter((center: DemoCenterFromAPI) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.cityZip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch =
        selectedType === "" ||
        center.buildingType.toLowerCase() === selectedType.toLowerCase();

      // Equipment filter
      const equipmentMatch =
        selectedEquipment === "" ||
        center.demoCenterEquipments.some((equip) =>
          equip.equipment.name
            .toLowerCase()
            .includes(selectedEquipment.toLowerCase()),
        );

      return searchMatch && typeMatch && equipmentMatch;
    });
  }, [data, searchTerm, selectedType, selectedEquipment]);

  // Calculate pagination info
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);
  const currentPage = pagination.pageIndex;
  const startItem = (currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(currentPage * pagination.pageSize, totalItems);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPage }));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({ pageIndex: 1, pageSize: newPageSize });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-x-4">
        <div className="relative col-span-2">
          <Input
            placeholder="Search Location, City, Zip..."
            className="w-full py-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition hover:bg-gray-100"
            aria-label="Use my location"
          >
            <MapPin size={18} />
          </button>
        </div>

        <div className="col-span-3 flex flex-col gap-4 md:flex-row">
          <div className="flex w-full items-center gap-2">
            <Select
              value={selectedDistance}
              onValueChange={setSelectedDistance}
            >
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Select Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5mi</SelectItem>
                <SelectItem value="10">10mi</SelectItem>
                <SelectItem value="25">25mi</SelectItem>
                <SelectItem value="50">50mi</SelectItem>
                <SelectItem value="100">100mi</SelectItem>
                <SelectItem value="200">200mi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full py-6">
              <SelectValue placeholder="Select Building Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESIDENTIAL">RESIDENTIAL</SelectItem>
              <SelectItem value="BUSINESS">BUSINESS</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedEquipment}
            onValueChange={setSelectedEquipment}
          >
            <SelectTrigger className="w-full py-6">
              <SelectValue placeholder="Filter By Equipments" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.name}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {isValidating ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              Loading demo centers...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-lg text-red-500">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to fetch demo centers"}
            </p>
          </div>
        ) : filteredDemoCenters.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No demo centers found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Demo Centers Cards */}
            {filteredDemoCenters.map((center: DemoCenterFromAPI) => (
              <Card
                key={center.id}
                className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3"
              >
                <div>
                  <h3 className="text-lg font-bold uppercase">{center.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    TYPE: {center.buildingType.toUpperCase()}
                  </p>
                  <div className="mt-4 h-48 w-full overflow-hidden rounded-md bg-gray-100">
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
                  <p className="pt-2 text-sm font-semibold">BIO:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {center.bio}
                  </p>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <p className="text-sm font-bold uppercase">
                    Equipment Onsite
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {center.demoCenterEquipments.map((equip) => (
                      <span
                        key={equip.id}
                        className="inline-block rounded bg-gray-300 px-2 py-1 text-xs text-primary"
                      >
                        {equip.equipment.name}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-blue-900">VISIT US</h2>
                  <p className="text-sm leading-5">
                    {center.address} <br />
                    {center.cityZip} <br />
                    {center.contact}
                  </p>
                  {center?.buildingType === "BUSINESS" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded bg-gray-100 p-3">
                        <h4 className="text-sm font-semibold">WEEKDAYS</h4>
                        <p className="text-xs text-muted-foreground">
                          {center.weekdays.length > 0
                            ? center.weekdays.join(", ")
                            : "Not specified"}
                        </p>
                        <p className="text-sm font-semibold">
                          {center.weekdayOpen && center.weekdayClose
                            ? `${center.weekdayOpen} - ${center.weekdayClose}`
                            : "Contact for hours"}
                        </p>
                      </div>
                      <div className="rounded bg-gray-100 p-3">
                        <h4 className="text-sm font-semibold">WEEKENDS</h4>
                        <p className="text-xs text-muted-foreground">
                          {center.weekends.length > 0
                            ? center.weekends.join(", ")
                            : "Not specified"}
                        </p>
                        <p className="text-sm font-semibold">
                          {center.weekendOpen && center.weekendClose
                            ? `${center.weekendOpen} - ${center.weekendClose}`
                            : "Contact for hours"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="rounded bg-gray-100 p-3">
                    <h4 className="text-sm font-semibold">AVAILABILITY</h4>
                    <p className="text-sm">
                      {center.availability || "Contact for availability"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6 sm:justify-between">
                {/* Pagination range indicator */}
                <div className="text-sm text-muted-foreground">
                  Showing {startItem} &minus; {endItem} of {totalItems}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
                  {/* Rows per page selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      Items per page:
                    </label>
                    <Select
                      value={pagination.pageSize.toString()}
                      onValueChange={(value) =>
                        handlePageSizeChange(Number(value))
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select Limit" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((limit) => (
                          <SelectItem key={limit} value={limit.toString()}>
                            {limit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Previous and Next buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DemoCentersCards;
