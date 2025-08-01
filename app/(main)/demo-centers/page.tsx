import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import DemoCentersCards from "../_components/demo-centers/DemoCentersCards";
import MapDemoCenter from "../_components/demo-centers/MapDemoCenter";

export default function DemoCenterPage() {
  return (
    <main className="container mx-auto max-w-[1200px] space-y-10 px-4 py-10">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">DEMO CENTER</h1>

        <Link href="/demo-center-form">
          <Button className="cursor-pointer rounded-sm bg-[#69727D] px-2 py-2 text-xs text-white uppercase sm:text-base md:px-6 md:tracking-wide">
            <CircleArrowRight />
            Apply to be a demo center affiliate
          </Button>
        </Link>
      </section>

      <div className="w-full">
        <MapDemoCenter />
      </div>

      <DemoCentersCards />
    </main>
  );
}
