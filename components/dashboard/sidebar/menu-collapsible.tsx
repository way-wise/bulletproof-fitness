import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuCollapsibleProps = {
  icon: React.ReactNode;
  title: string;
  baseUrl: string;
  children: React.ReactNode;
};

const MenuCollapsible = ({
  icon,
  title,
  baseUrl,
  children,
}: MenuCollapsibleProps) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const active = pathName.startsWith(baseUrl);

  // Keep active menu expanded on reload
  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-lg font-medium transition-colors",
            {
              "bg-primary text-primary-foreground": active,
              "text-secondary-foreground/70 hover:bg-secondary": !active,
            },
          )}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronDown
            className={`icon transition ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="my-1.5 ml-[22px] space-y-1.5 border-l">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MenuCollapsible;
