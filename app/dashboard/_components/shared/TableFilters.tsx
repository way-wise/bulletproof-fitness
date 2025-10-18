"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, X } from "lucide-react";
import { useCallback, useMemo } from "react";

export type FilterOption = {
  value: string;
  label: string;
};

export type SortOption = {
  field: string;
  label: string;
};

export type FilterConfig = {
  multiSelects?: {
    key: string;
    label: string;
    placeholder: string;
    options: FilterOption[];
  }[];
  sortOptions?: SortOption[];
  showSearch?: boolean;
  searchPlaceholder?: string;
};

export type FilterValues = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | string[] | undefined;
};

interface TableFiltersProps {
  config: FilterConfig;
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset?: () => void;
}

export function TableFilters({
  config,
  values,
  onChange,
  onReset,
}: TableFiltersProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, search: e.target.value });
    },
    [values, onChange],
  );

  const handleMultiSelectChange = useCallback(
    (key: string, selectedValues: string[]) => {
      onChange({ ...values, [key]: selectedValues });
    },
    [values, onChange],
  );

  const handleSortByChange = useCallback(
    (sortBy: string) => {
      onChange({ ...values, sortBy });
    },
    [values, onChange],
  );

  const toggleSortOrder = useCallback(() => {
    const newOrder = values.sortOrder === "asc" ? "desc" : "asc";
    onChange({ ...values, sortOrder: newOrder });
  }, [values, onChange]);

  const hasActiveFilters = useMemo(() => {
    if (values.search && values.search.trim() !== "") return true;
    if (config.multiSelects) {
      for (const multiSelect of config.multiSelects) {
        const value = values[multiSelect.key];
        if (Array.isArray(value) && value.length > 0) return true;
      }
    }
    return false;
  }, [values, config]);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    } else {
      const resetValues: FilterValues = {
        search: "",
        sortBy: config.sortOptions?.[0]?.field || "",
        sortOrder: "desc",
      };
      if (config.multiSelects) {
        config.multiSelects.forEach((ms) => {
          resetValues[ms.key] = [];
        });
      }
      onChange(resetValues);
    }
  }, [onReset, onChange, config]);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Search Input */}
        {config.showSearch && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Search</Label>
            <Input
              type="search"
              placeholder={config.searchPlaceholder || "Search..."}
              value={values.search || ""}
              onChange={handleSearchChange}
              className="h-9"
            />
          </div>
        )}

        {/* Multi-Select Filters */}
        {config.multiSelects?.map((multiSelect) => (
          <div key={multiSelect.key} className="space-y-2">
            <Label className="text-xs font-medium">{multiSelect.label}</Label>
            <MultiSelect
              options={multiSelect.options}
              selected={(values[multiSelect.key] as string[]) || []}
              onChange={(selected) =>
                handleMultiSelectChange(multiSelect.key, selected)
              }
              placeholder={multiSelect.placeholder}
              className="h-9"
            />
          </div>
        ))}

        {/* Sort By */}
        {config.sortOptions && config.sortOptions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Sort By</Label>
            <div className="flex gap-2">
              <Select
                value={values.sortBy || config.sortOptions[0].field}
                onValueChange={handleSortByChange}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {config.sortOptions.map((option) => (
                    <SelectItem key={option.field} value={option.field}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={toggleSortOrder}
                title={
                  values.sortOrder === "asc"
                    ? "Ascending order"
                    : "Descending order"
                }
              >
                {values.sortOrder === "asc" ? (
                  <ArrowUpAZ className="h-4 w-4" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
