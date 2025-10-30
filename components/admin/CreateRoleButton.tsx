"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateRoleDialog } from "./CreateRoleDialog";

export function CreateRoleButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Role
      </Button>
      <CreateRoleDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
