import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import DemoCentersCards from "../_components/demo-centers/DemoCentersCards";
import MapDemoCenter from "../_components/demo-centers/MapDemoCenter";

export default function DemoCenterPage() {
  return (
    <main className="mx-auto max-w-[1200px] space-y-10 px-4 py-10">
      <section className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">DEMO CENTER</h1>

        <Link href="/demoCenterForm">
          <Button className="cursor-pointer rounded-sm bg-[#69727D] px-6 py-2 tracking-wide text-white uppercase">
            <CircleArrowRight />
            Apply to be a demo center affiliate
          </Button>
        </Link>
      </section>

      <MapDemoCenter />

      <DemoCentersCards />
    </main>
  );
}
