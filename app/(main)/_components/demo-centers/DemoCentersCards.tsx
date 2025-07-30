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
import { DemoCenter } from "@/lib/dataTypes";
import { demoCentersData } from "@/lib/default-data";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const DemoCentersCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("5");

  // Filter demo centers based on search and filters
  const filteredDemoCenters = useMemo(() => {
    return demoCentersData.filter((center: DemoCenter) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.zipCode.includes(searchTerm);

      // Type filter
      const typeMatch = selectedType === "" || center.type === selectedType;

      // Equipment filter
      const equipmentMatch =
        selectedEquipment === "" ||
        center.equipment.some((equip) =>
          equip.toLowerCase().includes(selectedEquipment.toLowerCase()),
        );

      // Distance filter (if distance is available)
      const distanceMatch =
        selectedDistance === "" ||
        !center.distance ||
        center.distance <= parseInt(selectedDistance);

      return searchMatch && typeMatch && equipmentMatch && distanceMatch;
    });
  }, [searchTerm, selectedType, selectedEquipment, selectedDistance]);

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
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="isolator">Isolator</SelectItem>
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
              <SelectItem value="rack">Rack</SelectItem>
              <SelectItem value="machine">Machine</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="isolation">Isolation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {filteredDemoCenters.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No demo centers found matching your criteria.
            </p>
          </div>
        ) : (
          filteredDemoCenters.map((center: DemoCenter) => (
            <Card
              key={center.id}
              className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3"
            >
              <div>
                <h3 className="text-lg font-bold uppercase">{center.name}</h3>
                <p className="text-sm text-muted-foreground">
                  TYPE: {center.type.toUpperCase()}
                </p>
                <div className="mt-4 h-48 w-full overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={center?.imageUrl}
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
                </div>
                <p className="pt-2 text-sm font-semibold">BIO:</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {center.bio}
                </p>
              </div>

              <div className="space-y-3 md:col-span-2">
                <p className="text-sm font-bold uppercase">Equipment Onsite</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {center.equipment.map((equip, index) => (
                    <span
                      key={index}
                      className="inline-block rounded bg-gray-300 px-2 py-1 text-xs text-primary"
                    >
                      {equip}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-blue-900">VISIT US</h2>
                <p className="text-sm leading-5">
                  {center.address.street} <br />
                  {center.address.city}, {center.address.state}{" "}
                  {center.address.zipCode} <br />
                  {center.phone}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded bg-gray-100 p-3">
                    <h4 className="text-sm font-semibold">WEEKDAYS</h4>
                    <p className="text-xs text-muted-foreground">Mon - Fri</p>
                    <p className="text-sm font-semibold">
                      {center.hours.weekdays.open} -{" "}
                      {center.hours.weekdays.close}
                    </p>
                  </div>
                  <div className="rounded bg-gray-100 p-3">
                    <h4 className="text-sm font-semibold">WEEKENDS</h4>
                    <p className="text-xs text-muted-foreground">Sat - Sun</p>
                    <p className="text-sm font-semibold">
                      {center.hours.weekends.open} -{" "}
                      {center.hours.weekends.close}
                    </p>
                  </div>
                </div>

                <div className="rounded bg-gray-100 p-3">
                  <h4 className="text-sm font-semibold">AVAILABILITY</h4>
                  <p className="text-sm">{center.availability}</p>
                </div>

                {center.distance && (
                  <div className="text-sm text-muted-foreground">
                    Distance: {center.distance} miles away
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DemoCentersCards;
