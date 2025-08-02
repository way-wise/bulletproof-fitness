// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Check, ChevronsUpDown, X } from "lucide-react";
// import * as React from "react";

// interface Option {
//   value: string;
//   label: string;
// }

// interface MultiSelectProps {
//   options: Option[];
//   selected: string[];
//   onChange: (selected: string[]) => void;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
// }

// export function MultiSelect({
//   options,
//   selected,
//   onChange,
//   placeholder = "Select options...",
//   className,
//   disabled = false,
// }: MultiSelectProps) {
//   const [open, setOpen] = React.useState(false);

//   const handleUnselect = (item: string) => {
//     onChange(selected.filter((i) => i !== item));
//   };

//   const handleSelect = (item: string) => {
//     if (selected.includes(item)) {
//       handleUnselect(item);
//     } else {
//       onChange([...selected, item]);
//     }
//   };

//   // Filter out already selected options
//   const availableOptions = options.filter(
//     (option) => !selected.includes(option.value),
//   );

//   return (
//     <div className={cn("w-full", className)}>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className={cn(
//               "w-full justify-between text-left font-normal",
//               selected.length === 0 ? "h-10" : "min-h-10 py-2",
//             )}
//             disabled={disabled}
//           >
//             <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
//               {selected.length === 0 ? (
//                 <span className="text-muted-foreground">{placeholder}</span>
//               ) : (
//                 <>
//                   {selected.slice(0, 2).map((item) => (
//                     <Badge
//                       variant="secondary"
//                       key={item}
//                       className="max-w-[100px] truncate text-xs"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleUnselect(item);
//                       }}
//                     >
//                       <span className="truncate">
//                         {options.find((option) => option.value === item)
//                           ?.label || item}
//                       </span>
//                       <button
//                         className="ml-1 flex-shrink-0 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             handleUnselect(item);
//                           }
//                         }}
//                         onMouseDown={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                         }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           handleUnselect(item);
//                         }}
//                       >
//                         <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
//                       </button>
//                     </Badge>
//                   ))}
//                   {selected.length > 2 && (
//                     <Badge variant="secondary" className="text-xs">
//                       +{selected.length - 2} more
//                     </Badge>
//                   )}
//                 </>
//               )}
//             </div>
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-full p-0">
//           <Command>
//             <CommandInput placeholder="Search..." />
//             <CommandList>
//               <CommandEmpty>No option found.</CommandEmpty>
//               <CommandGroup>
//                 {availableOptions.map((option) => (
//                   <CommandItem
//                     key={option.value}
//                     onSelect={() => handleSelect(option.value)}
//                   >
//                     <Check
//                       className={cn(
//                         "mr-2 h-4 w-4",
//                         selected.includes(option.value)
//                           ? "opacity-100"
//                           : "opacity-0",
//                       )}
//                     />
//                     {option.label}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

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
}

export const MultiSelect = ({
  options,
  placeholder = "Select options...",
  selected,
  onChange,
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
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
  );
};
