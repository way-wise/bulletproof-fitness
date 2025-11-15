import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading form...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
