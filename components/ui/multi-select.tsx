"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export const MultiSelect = ({
  options,
  placeholder = "Select options...",
  selected,
  onChange,
  className,
  triggerClassName,
  disabled = false,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full justify-between rounded-sm text-[14px]",
              triggerClassName,
              selected.length === 0 && "text-muted-foreground",
            )}
          >
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          sideOffset={4}
        >
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty>No option found.</CommandEmpty>

            <div
              className="max-h-40 overflow-y-auto"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleItem(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "flex size-[18px] shrink-0 items-center justify-center rounded-sm border border-zinc-400",
                        selected.includes(option.value) &&
                          "&[svg]:text-white border-black bg-primary dark:border-white",
                      )}
                    >
                      {selected.includes(option.value) ? (
                        <Check className="size-4 text-primary-foreground" />
                      ) : null}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </Command>

          {/* Selected badges */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1 border-t p-2">
              {selected.map((item) => {
                const label =
                  options.find((opt) => opt.value === item)?.label || item;
                return (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="rounded-sm px-2 font-normal"
                    title={label}
                  >
                    {label}
                    <X
                      className="ml-1 size-3 shrink-0 cursor-pointer"
                      onClick={() => toggleItem(item)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
