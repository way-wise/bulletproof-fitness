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
import { Check, X } from "lucide-react";
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
}

export const MultiSelect = ({
  options,
  placeholder = "Select options...",
  selected,
  onChange,
  className,
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
            className={cn(
              "w-full justify-between rounded-sm py-4 text-[14px]",
              selected.length === 0 && "text-muted-foreground",
            )}
          >
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty>No option found.</CommandEmpty>

            <ScrollArea className="max-h-40">
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleItem(option.value)}
                    className="cursor-pointer"
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                      {selected.includes(option.value) ? (
                        <Check className="h-4 w-4" />
                      ) : null}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
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
                    className="max-w-[120px] truncate rounded-sm px-2 font-normal"
                    title={label}
                  >
                    {label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
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
