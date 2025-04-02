"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/providers/sidebar-provider";
import { Menu } from "lucide-react";

const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      aria-label="Toggle sidebar"
      onClick={toggleSidebar}
      size="icon"
      variant="secondary"
    >
      <Menu />
    </Button>
  );
};

export default SidebarToggle;
